import { Position } from "@/types/types";

export async function isStudentInPerson(studentLocation: Position, teacherLocation: Position): Promise<boolean> {
  const R = 6371e3; // Earth's radius in meters

  const lat1 = teacherLocation.lat * (Math.PI / 180);
  const lat2 = studentLocation.lat * (Math.PI / 180);
  const deltaLat = (studentLocation.lat - teacherLocation.lat) * (Math.PI / 180);
  const deltaLon = (studentLocation.long - teacherLocation.long) * (Math.PI / 180);

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return distance <= 100; // Consider in-person if within 100 meters
}