import prisma from "@/lib/prisma/prisma";
import { DefaultAPIResponse, verifyBody } from "@/lib/util/api";
import { getUserServer, parseError } from "@/lib/util/server_util";
import { RelationalCourse } from "@/types/types";
import { NextResponse } from "next/server";

export type CourseGetResponse = DefaultAPIResponse & {
  courses?: RelationalCourse[];
}

type CourseGetFullRequest = {
  userId: string;
  role: string;
}

export async function GET(request: Request) {
  try {
    // User
    const { user, response } = await getUserServer(request);
    if (response) return response;

    // Data
    const { searchParams } = new URL(request.url);

    const props: CourseGetFullRequest = { userId: user.id, role: searchParams.get('role') ?? '' };
    const props_error = verifyBody<CourseGetFullRequest>(props, 'api/course get');
    if (props_error) return props_error;
    if (props.role !== 'teacher' && props.role !== 'student') {return NextResponse.json<CourseGetResponse>({ status: 'error', message: `Role ${props.role} is invalid` }, {status: 400});}


    const { userId, role } = props;

    const profile = await prisma.profile.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true,
        ...(role === 'teacher' ? { teachingCoursees: true } : { enrolledCoursees: true }),
      }
    });

    if (!profile) {return NextResponse.json<CourseGetResponse>({ status: 'error', message: 'Profile not found' }, {status: 404});}

    const coursees = profile[role === 'teacher' ? 'teachingCoursees' : 'enrolledCoursees'];

    return NextResponse.json<CourseGetResponse>({ status: 'success', message: '', courses: coursees });
  } catch (e: any) {
    console.log('api/course get error')
    await parseError(e.message, e.code);
    return NextResponse.json<CourseGetResponse>({ status: 'error', message: 'There was an issue loading the coursees' }, { status: 500 });
  }
}

export type CoursePostRequest = {
  name: string;
}

export type CoursePostResponse = DefaultAPIResponse & {
  id?: string
}

type CoursePostFullRequest = CoursePostRequest & {
  userId: string;
}

export async function POST(request: Request) {
  try {
    // User
    const { user, response } = await getUserServer(request);
    if (response) return response;

    // Data
    const body = await request.json() as CoursePostRequest;

    const props: CoursePostFullRequest = { userId: user.id, name: body.name};
    const props_error = verifyBody<CoursePostFullRequest>(props, 'api/course post');
    if (props_error) return props_error;

    const { userId, name } = props;

    // Logic
    const course = await prisma.course.create({
      data: {
        name: name,
        teacherId: userId,
      }
    });

    return NextResponse.json<CoursePostResponse>({ status: 'success', message: 'Course created', id: course.id });
  } catch (e: any) {
    console.log('api/course post error')
    await parseError(e.message, e.code);
    return NextResponse.json<CoursePostResponse>({ status: 'error', message: 'There was an issue creating the course' }, { status: 500 });
  }
}