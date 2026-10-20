import type { Workout } from "@/lib/types";

const API_URLS = [
  "https://api.abcz.workers.dev/api/fitlog",
  "https://api.api-store.workers.dev/api/fitlog",
];

export function isWorkout(value: unknown): value is Workout {
  if (!value || typeof value !== "object") return false;

  const workout = value as Record<string, unknown>;
  return (
    typeof workout.id === "number" &&
    typeof workout.name === "string" &&
    typeof workout.image === "string" &&
    Array.isArray(workout.muscleGroups) &&
    workout.muscleGroups.every((group) => typeof group === "string") &&
    typeof workout.equipment === "string" &&
    typeof workout.difficulty === "string" &&
    typeof workout.duration === "number" &&
    typeof workout.caloriesBurned === "number" &&
    typeof workout.sets === "number" &&
    typeof workout.reps === "string" &&
    typeof workout.rating === "number" &&
    typeof workout.description === "string" &&
    Array.isArray(workout.instructions) &&
    workout.instructions.every((step) => typeof step === "string")
  );
}

export function isWorkoutList(value: unknown): value is Workout[] {
  return Array.isArray(value) && value.every(isWorkout);
}

async function fetchWorkoutList(url: string): Promise<Workout[]> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Workout API returned ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (!isWorkoutList(payload)) {
    throw new Error("Workout API returned data in an unexpected format.");
  }

  return payload;
}

export async function getWorkouts(): Promise<Workout[]> {
  try {
    return await fetchWorkoutList(API_URLS[0]);
  } catch (primaryError) {
    console.warn("The primary FitLog API failed; trying the alternate API.", primaryError);
  }

  try {
    return await fetchWorkoutList(API_URLS[1]);
  } catch (fallbackError) {
    console.error("Both FitLog workout APIs failed.", fallbackError);
    throw new Error("Workout data could not be loaded from either API.");
  }
}
