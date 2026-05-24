
'use client'; 

import { useSearchParams } from "next/navigation";
import { AttendanceCard } from "@/components/attendanceCard";
import { AttendanceType } from "@/lib/prisma/generated/prisma/enums";

export default function CarmenDeveloperPage() {
  return (
    <div className="flex flex-col gap-4 p-8 bg-slate-900 min-h-screen">
      <AttendanceCard attendanceType={"IN_PERSON" as AttendanceType} time="7:00 PM" />
<AttendanceCard attendanceType={"ABSENT" as AttendanceType} time="7:00 PM" />
<AttendanceCard attendanceType={"ONLINE" as AttendanceType} time="7:00 PM" />
<AttendanceCard attendanceType={"SELF_EXCUSED" as AttendanceType} time="7:00 PM" />
<AttendanceCard attendanceType={"UNKNOWN" as AttendanceType} time="7:00 PM" />
    </div>
  );
}