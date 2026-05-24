// components can only take one paramenter, if you want to give it multiple parameters you have to do it in an object
// {} ← this is an object

import { Course, Event } from "@/lib/prisma/generated/prisma/client";

// { name } : { name: string }
// to specify the type of the object, put ":" after the object ans specify the datatypes of the things in the object

export function ScheduleEventComponent({ event }: { event: Event }) {
    return (
        <button className="event">
            <a href="/teacher-dashboards/{class}" className="a-link-normal">
                <p className='font-bold'>{event.name}</p>
                <p>{event.startTime}</p>
                <p>{event.endTime}</p>
            </a>
        </button>
    );
}


export function ScheduleComponent({ events }: { events: Event[] }) {
    return (
        <div className='w-full h-full'>
            {events.map((event) => (
                <ScheduleEventComponent key={event.id} event={event} />
            ))}
        </div>
    );
}

export default function DashboardComponent({ role, courses, events }: { role: string, courses: Course[], events: Event[] }) {

    return (
        <div>
            <p className="intro">
                <h1 className="a-size-large a-spacing-small">Welcome to your {role} dashboard!</h1>
            </p>

            <div className="classes">
                <CourseListComponent></CourseListComponent>

                {/* <h1>Classes</h1> */}

                {/* <table>
                <button className="class">
                    <a href="/teacher-dashboards/{class}" className="a-link-normal">ClassName1</a>
                </button>

                <button className="class">
                    <a href="/teacher-dashboards/{class}" className="a-link-normal">ClassName2</a>
                </button>
            </table> */}
            </div>

            <div className="Scehdule">
                <ScheduleComponent></ScheduleComponent>

                {/* <h1>Schedule</h1>
                <table>
                    <div className="schedule-table">
                        <thead>
                            <tr><Event /></tr>
                        </thead>

                    </div>
                </table> */}
            </div>
        </div >
    )
}