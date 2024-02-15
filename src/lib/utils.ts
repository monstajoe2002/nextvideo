import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatRelativeDate(date: Date) {
  const relativeDate = date.valueOf() - Date.now();
  if (relativeDate < 1000 * 60 * 60 * 24) {
    return new Intl.RelativeTimeFormat("system", {
      numeric: "auto",
    }).format(Math.round(relativeDate / (1000 * 60 * 60)), "hours");
  }
  return new Intl.RelativeTimeFormat("system", {
    numeric: "auto",
  }).format(Math.round(relativeDate / (1000 * 60 * 60 * 24)), "days");
}
export function formatUploadDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}
export function genRandStr(len: number) {
  return Math.random()
    .toString(36)
    .substring(2, len + 2);
}
