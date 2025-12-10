import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  const value = typeof date === "string" ? new Date(date) : date;
  return value.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const isDev = process.env.NODE_ENV === 'development'

export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  const pluralForm = plural ?? `${singular}s`;
  return count === 1 ? singular : pluralForm;
}
