import React from "react";
import {CheckCircle, XCircle, Clock, MapPin, CheckCircle2} from "lucide-react";

export function AttendanceCard({ status, message, time }: { status: string, message: string, time: string }) {
    const statusConfig = {
        present: {
            bg: "big-green-600",
            icon: <CheckCircle2 className="w-8 h-8 text-white" />,
            label: "Present"
        },
        absent: {
            bg: "big-red-600",
            icon: <XCircle className="w-8 h-8 text-white" />,
            label: "Absent"
        },
        online: {
            bg: "big-amber-600",
            icon: <Clock className="w-8 h-8 text-white" />,
            label: "Online"
        }
    }
    return (
        <div className={'w-full max-w-md'}>
            <div className="flex items-center gap-2">
                <div>
                </div>
            </div>
        </div>
    )
}