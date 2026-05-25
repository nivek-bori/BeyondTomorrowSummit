// components can only take one paramenter, if you want to give it multiple parameters you have to do it in an object
// {} ← this is an object

import { Course, Event } from "@/prisma/schema.prisma
import Navbar from "./Navbar"
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

export function CourseItemComponent({ course }: { course: Course }) {
    return (
        <button className="course">
            <a href="/teacher-dashboards/{class}" className="a-link-normal">
                <p className='font-bold'>{course.name}</p>
                <p>{course.startTime}</p>
                <p>{course.endTime}</p>
            </a>
        </button>
    );
}


export function CourseListComponent({ courses }: { courses: Course[] }) {
    return (
        <div className='w-full h-full'>
            {courses.map((course) => (
                <CourseItemComponent key={course.id} course={course} />
            ))}
        </div>
    );
}

export default function DashboardComponent({ role, courses, events }: { role: string, courses: Course[], events: Event[] }) {

    return (
        <div>
            <div className="navbar">
                <Navbar />
            </div> 

            <div className="classes" style={{ textAlign: 'left' }}>
                <CourseListComponent courses={courses} />

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

            <div className="Scehdule" style={{ textAlign: 'right' }}>
                
                <ScheduleComponent events={events} />

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
    );
}
