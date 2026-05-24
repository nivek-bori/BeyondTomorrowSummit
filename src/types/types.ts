import { Attendance, AttendanceType, Course, Profile } from "@/lib/prisma/generated/prisma/client";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

// ROLES
export type Role = 'ADMIN' | 'USER' | 'GUEST';

const roleRank: Record<Role, number> = {
  GUEST: 0,
  USER: 1,
  ADMIN: 2,
};

function normalizeRole(role?: string | null): Role {
  const normalized = role?.toUpperCase();
  if (normalized === 'ADMIN') return 'ADMIN';
  if (normalized === 'USER') return 'USER';
  return 'GUEST';
}

export function isAuthorized(currentRole?: string | null, requiredRole?: string | null): boolean {
  if (!requiredRole) return true;
  const current = normalizeRole(currentRole);
  const required = normalizeRole(requiredRole);
  return roleRank[current] >= roleRank[required];
}

export type RelationalProfile = Partial<Profile> & {
  teacher?: Partial<Course>;
  events?: Partial<Event>[];
}

export type RelationalCourse = Partial<Course> & {
  teacher?: Partial<Profile>;
  students?: Partial<Profile>[];
  events?: Partial<Event>[];
}

export type RelationalEvent = Partial<Event> & {
  course?: Partial<Course>;
  attendances?: Partial<Attendance>[];
}

export type RelationalAttendance = Partial<Attendance> & {
  student?: Partial<Profile>;
  event?: Partial<Event>;
}

export type Position = {
  lat: number;
  long: number; 
}

// this is what the student can report themselves
export type StudentAttendanceTypes = 'check_in' | 'self_excuse';