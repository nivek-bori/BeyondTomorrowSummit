import prisma from "@/lib/prisma/prisma";
import { DefaultAPIResponse, verifyBody } from "@/lib/util/api";
import { getUserServer, parseError } from "@/lib/util/server_util";
import { Position } from "@/types/types";
import { NextResponse } from "next/server";

export type TeacherAttendancePostRequest = {
  eventId: string;
  position: Position | null;
}

export type TeacherAttendancePostResponse = DefaultAPIResponse & {
}

type TeacherAttendancePostFullRequest = TeacherAttendancePostRequest & {
  userId: string;
}

export async function POST(request: Request) {
  try {
    // User
    const { user, response } = await getUserServer(request);
    if (response) return response;

    // Data
    const body = await request.json() as TeacherAttendancePostRequest;

    const props: TeacherAttendancePostFullRequest = { userId: user.id, eventId: body.eventId, position: body.position };
    const props_error = verifyBody<TeacherAttendancePostFullRequest>(props, 'api/teacher attendance post');
    if (props_error) return props_error;

    const { userId, eventId, position } = props;

    // Logic
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        course: true,
      }
    });
    if (!event) return NextResponse.json<TeacherAttendancePostResponse>({ status: 'error', message: 'Event not found' }, { status: 404 });
    if (event.course.teacherId !== userId) return NextResponse.json<TeacherAttendancePostResponse>({ status: 'error', message: 'You do not have access to this event' }, { status: 403 });

    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        teacherLocationLat: position ? position.lat : null,
        teacherLocationLong: position ? position.long : null,
      },
    });

    return NextResponse.json<TeacherAttendancePostResponse>({ status: 'success', message: `Attendance ${position ? 'opened' : 'closed'}` });
  } catch (e: any) {
    console.log('api/teacher attendance post error')
    await parseError(e.message, e.code);
    return NextResponse.json<TeacherAttendancePostResponse>({ status: 'error', message: 'There was an issue changing attendance' }, { status: 500 });
  }
}