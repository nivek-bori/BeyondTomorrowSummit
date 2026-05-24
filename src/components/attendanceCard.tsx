'use client';

import React from "react";
import { CheckCircle2, XCircle, Clock, MapPin, AlertCircle } from "lucide-react";
import { AttendanceType } from "@/lib/prisma/generated/prisma/enums";

export function AttendanceCard({ attendanceType, time }: { attendanceType: AttendanceType, time: string }) {

  const configs: Record<AttendanceType, { bg: string, icon: React.ReactNode, label: string }> = {
    IN_PERSON: { bg: "bg-green-600", icon: <CheckCircle2 className="w-8 h-8 text-white" />, label: "Present" },
    ONLINE: { bg: "bg-amber-500", icon: <Clock className="w-8 h-8 text-white" />, label: "Online" },
    SELF_EXCUSED: { bg: "bg-blue-600", icon: <AlertCircle className="w-8 h-8 text-white" />, label: "Excused" },
    ABSENT: { bg: "bg-red-600", icon: <XCircle className="w-8 h-8 text-white" />, label: "Absent" },
    UNKNOWN: { bg: "bg-slate-700", icon: <MapPin className="w-8 h-8 text-white" />, label: "Unknown" },
};

  const config = configs[attendanceType];

  return (
    <div className={`w-full max-w-md ${config.bg} rounded-lg shadow-xl p-6 flex items-center gap-5 transition-all duration-500`}>
      <div className="bg-white/20 p-3 rounded-full">{config.icon}</div>
      <div className="grow text-white">
        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{config.label}</p>
        {time && (
          <div className="flex items-center gap-1 mt-2 text-white/50 text-xs">
            <Clock size={12} /><span>{time}</span>
          </div>
        )}
      </div>
    </div>
  );
}