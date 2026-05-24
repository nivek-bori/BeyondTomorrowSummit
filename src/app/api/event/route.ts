import { Course, Prisma, Profile } from "@/lib/prisma/generated/prisma/client";
import prisma from "@/lib/prisma/prisma";
import { DefaultAPIResponse, verifyBody } from "@/lib/util/api";
import { getUserServer, parseError } from "@/lib/util/server_util";
import { RelationalEvent } from "@/types/types";
import { NextResponse } from "next/server";

export type EventGetResponse = DefaultAPIResponse & {
  events?: RelationalEvent[];
}

type EventGetFullRequest = {
  userId: string;
  courseId: string;
} | {
  userId: string;
  role: 'teacher' | 'student';
}

async function getEventsByCourseId(userId: string, courseId: string): Promise<NextResponse<EventGetResponse>> {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      teacherId: true,
      students: {
        select: {
          id: true,
        },
      },
      events: true,
    },
  });

  if (!course) return NextResponse.json<EventGetResponse>({ status: 'error', message: 'Could not find this course\'s events' }, { status: 404 });

  if (course.teacherId !== userId && !course.students.some((student: Profile) => student.id === userId)) return NextResponse.json<EventGetResponse>({ status: 'error', message: 'You do not have access to this course' }, { status: 403 });

  return NextResponse.json<EventGetResponse>({ status: 'success', message: '', events: course.events });
}

async function getEventsByRole(userId: string, role: 'teacher' | 'student'): Promise<NextResponse<EventGetResponse>> {
  const selectQuery: Prisma.ProfileSelect = (role === 'teacher' ? { teachingCoursees: { select: { events: true } } } : { enrolledCoursees: { select: { events: true } } });
  
  const profile = await prisma.profile.findUnique({
    where: {
      id: userId,
    },
    select: selectQuery,
  });

  if (!profile) return NextResponse.json<EventGetResponse>({ status: 'error', message: 'Could not find your events' }, { status: 404 });


  const events = (role === 'teacher' ? profile.teachingCoursees : profile.enrolledCoursees)?.flatMap((course: Course) => course.events) ?? [];

  return NextResponse.json<EventGetResponse>({ status: 'success', message: '', events: events });
}

export async function GET(request: Request) {
  try {
    // User
    const { user, response } = await getUserServer(request);
    if (response) return response;

    // Data
    const { searchParams } = new URL(request.url);

    const props_a: EventGetFullRequest = { userId: user.id, courseId: searchParams.get('courseId') ?? '' };
    const props_b: EventGetFullRequest = { userId: user.id, role: searchParams.get('role') as 'teacher' | 'student' ?? '' };

    const props_error_a = verifyBody<EventGetFullRequest>(props_a, 'api/event get');
    const props_error_b = verifyBody<EventGetFullRequest>(props_a, 'api/event get');
    if (props_error_a && props_error_b) return NextResponse.json<EventGetResponse>({ status: 'error', message: 'Invalid request parameters' }, { status: 400 });

    if (props_error_a === null) { // request courseId
      const { userId, courseId } = props_a;
      return await getEventsByCourseId(userId, courseId);
    } else {
      const { userId, role } = props_b;
      return await getEventsByRole(userId, role);
    }
  } catch (e: any) {
    console.log('api/event get error')
    await parseError(e.message, e.code);
    return NextResponse.json<EventGetResponse>({ status: 'error', message: 'There was an issue getting the events' }, { status: 500 });
  }
}

export type EventPostRequest = {
  courseId: string;
  name: string;
  startTime: string;
  endTime: string;
}

export type EventPostResponse = DefaultAPIResponse & {
  id?: string;
}

type EventPostFullRequest = EventPostRequest & {
  userId: string;
}

export async function POST(request: Request) {
  try {
    // User
    const { user, response } = await getUserServer(request);
    if (response) return response;

    // Data
    const body = await request.json() as EventPostRequest;

    const props: EventPostFullRequest = { userId: user.id, courseId: body.courseId, name: body.name, startTime: body.startTime, endTime: body.endTime };
    const props_error = verifyBody<EventPostFullRequest>(props, 'api/event post');
    if (props_error) return props_error;

    const { userId, courseId, name, startTime, endTime } = props;

    // Logic
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        students: true,
      }
    });

    if (!course) return NextResponse.json<EventPostResponse>({ status: 'error', message: 'Could not find this course' }, { status: 404 });
    if (course.teacherId !== userId) return NextResponse.json<EventPostResponse>({ status: 'error', message: 'You do not have access to this course' }, { status: 403 });

    const event = await prisma.event.create({
      data: {
        courseId: courseId,
        name: name,
        startTime: startTime,
        endTime: endTime,
      },
    });

    const attendancesReqPromises = Promise.all(
      course.students.map((student: Profile) => prisma.attendance.create({
        data: {
          studentId: student.id,
          eventId: event.id,
        },
      }))
    );
    await attendancesReqPromises;

    return NextResponse.json<EventPostResponse>({ status: 'success', message: 'Event created', id: event.id });
  } catch (e: any) {
    console.log('api/event post error')
    await parseError(e.message, e.code);
    return NextResponse.json<EventPostResponse>({ status: 'error', message: 'There was an issue creating the event' }, { status: 500 });
  }
}