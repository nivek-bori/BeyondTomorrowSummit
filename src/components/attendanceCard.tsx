'use client';

import React from "react";
import { CheckCircle2, XCircle, Clock, MapPin, AlertCircle } from "lucide-react";
import { AttendanceType } from "@/lib/prisma/generated/prisma/enums";

export function AttendanceCard({ attendanceType, time }: { attendanceType: AttendanceType, time: string }) {

  const configs: Record<AttendanceType, { border: string, icon: React.ReactNode, label: string, iconColor: string }> = {
    IN_PERSON: { border: "border-l-green-400", icon: <CheckCircle2 className="w-7 h-7" />, label: "Present", iconColor: "text-green-400" },
    ONLINE: { border: "border-l-amber-400", icon: <Clock className="w-7 h-7" />, label: "Online", iconColor: "text-amber-400" },
    SELF_EXCUSED: { border: "border-l-blue-400", icon: <AlertCircle className="w-7 h-7" />, label: "Excused", iconColor: "text-blue-400" },
    ABSENT: { border: "border-l-red-400", icon: <XCircle className="w-7 h-7" />, label: "Absent", iconColor: "text-red-400" },
    UNKNOWN: { border: "border-l-slate-400", icon: <MapPin className="w-7 h-7" />, label: "Unknown", iconColor: "text-slate-400" },
  };

  const config = configs[attendanceType];

  return (
    <div className={`w-full max-w-md bg-slate-800 border-l-4 ${config.border} rounded-lg shadow-xl p-6 flex items-center gap-5 transition-all duration-500`}>
      <div className={config.iconColor}>{config.icon}</div>
      <div className="grow text-white">
        <p className="text-2xl font-bold">{config.label}</p>
        {time && (
          <div className="flex items-center gap-1 mt-1 text-slate-400 text-sm">
            <Clock size={13} /><span>{time}</span>
          </div>
        )}
      </div>
    </div>
  );
}
