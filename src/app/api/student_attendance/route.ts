import { isStudentInPerson } from "@/lib/location/location_server";
import prisma from "@/lib/prisma/prisma";
import { DefaultAPIResponse, verifyBody } from "@/lib/util/api";
import { getUserServer, parseError } from "@/lib/util/server_util";
import { StudentAttendanceTypes, Position } from "@/types/types";
import { NextResponse } from "next/server";

export type StudentAttendancePostRequest = {
  eventId: string;
  type: StudentAttendanceTypes;
  position: Position;
}

export type StudentAttendancePostResponse = DefaultAPIResponse & {
}

type StudentAttendancePostFullRequest = StudentAttendancePostRequest & {
  userId: string;
}

async function handleCheckIn(event: any, userId: string, eventId: string, position: Position): Promise<NextResponse<StudentAttendancePostResponse>> {
  if (!event.teacherLocationLat || !event.teacherLocationLong) return NextResponse.json<StudentAttendancePostResponse>({ status: 'error', message: 'StudentAttendance has not been requested yet' }, { status: 400 });
  if (!event.isStudentAttendanceOpen) return NextResponse.json<StudentAttendancePostResponse>({ status: 'error', message: 'StudentAttendance is closed' }, { status: 400 });
  
  const isInPerson = await isStudentInPerson(position, { lat: event.teacherLocationLat, long: event.teacherLocationLong});

  try {
    await prisma.attendance.upsert({
      where: {
        studentId_eventId: {
          studentId: userId,
          eventId,
        },
      },
      update: {
        type: isInPerson ? "IN_PERSON" : "ONLINE",
      },
      create: {
        studentId: userId,
        eventId,
        type: isInPerson ? "IN_PERSON" : "ONLINE",
      },
    });

    return NextResponse.json<StudentAttendancePostResponse>({ status: 'success', message: `Marked as ${isInPerson ? "present in person" : "present online"}` }, { status: 200 });
  } catch (e: any) {
    console.log('api/student attendance handleCheckIn error')
    await parseError(e.message, e.code);
    return NextResponse.json<StudentAttendancePostResponse>({ status: 'error', message: 'There was an issue updating your attendance' }, { status: 500 });
  }
}

async function handleSelfExcuse(userId: string, eventId: string): Promise<NextResponse<StudentAttendancePostResponse>> {
  try {
    await prisma.attendance.upsert({
      where: {
        studentId_eventId: {
          studentId: userId,
          eventId,
        },
      },
      update: {
        type: 'SELF_EXCUSED'
      },
      create: {
        studentId: userId,
        eventId,
        type: 'SELF_EXCUSED'
      },
    });

    return NextResponse.json<StudentAttendancePostResponse>({ status: 'success', message: 'Marked as self excused' }, { status: 200 });
  } catch (e: any) {
    console.log('api/student attendance handleSelfExcuse error')
    await parseError(e.message, e.code);
    return NextResponse.json<StudentAttendancePostResponse>({ status: 'error', message: 'There was an issue updating your attendance' }, { status: 500 });
  }
}

export async function post(request: Request) {
  try {
    // User
    const { user, response } = await getUserServer(request);
    if (response) return response;

    // Data
    const body = await request.json() as StudentAttendancePostRequest;

    const props: StudentAttendancePostFullRequest = { userId: user.id, eventId: body.eventId, type: body.type, position: body.position };
    const props_error = verifyBody<StudentAttendancePostFullRequest>(props, 'api/student attendance post');
    if (props_error) return props_error;

    const { userId, eventId, type, position } = props;

    // Logic
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        isStudentAttendanceOpen: true,
        teacherLocationLat: true,
        teacherLocationLong: true,
      }
    });

    if (!event) return NextResponse.json<StudentAttendancePostResponse>({ status: 'error', message: 'Event not found' }, { status: 404 });

    if (type === 'check_in') {
      return await handleCheckIn(event, userId, eventId, position);
    } else if (type === 'self_excuse') {
      return await handleSelfExcuse(userId, eventId);
    } else {
      return NextResponse.json<StudentAttendancePostResponse>({ status: 'error', message: `Invalid type: ${type}` }, { status: 400 });
    }
  } catch (e: any) {
    console.log('api/student attendance post error')
    await parseError(e.message, e.code);
    return NextResponse.json<StudentAttendancePostResponse>({ status: 'error', message: 'There was an issue updating your attendance' }, { status: 500 });
  }
}