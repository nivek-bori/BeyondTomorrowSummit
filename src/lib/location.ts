'use client';

import { Position } from "@/types/types";

export async function getClientLocation(): Promise<Position> {
  return new Promise<Position>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({ lat: position.coords.latitude, long: position.coords.longitude });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  });
}