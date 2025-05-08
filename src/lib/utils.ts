import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Transform to make all fields nullable
export type Nullable<T> = { [K in keyof T]: T[K] | null };
