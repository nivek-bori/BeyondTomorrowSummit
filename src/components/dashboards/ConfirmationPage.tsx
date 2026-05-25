// components can only take one paramenter, if you want to give it multiple parameters you have to do it in an object
// {} ← this is an object

import { Course, Event } from "@/prisma/schema.prisma
import Navbar from "./Navbar"
// { name } : { name: string }
// to specify the type of the object, put ":" after the object ans specify the datatypes of the things in the object

export function ScheduleEventComponent({ event }: { event: Event }) {
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div className="centered-content" style={{ textAlign: 'center' }}>
                <h1>Attendance Verified</h1>
                <p>You are marked as {event.attendance} for this class.</p>
            </div>
        </div>
    );
}
