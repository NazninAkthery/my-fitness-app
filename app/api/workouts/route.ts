import { NextResponse } from "next/server";
import { getWorkouts } from "@/lib/api";

export async function GET() {
  try {
    return NextResponse.json(await getWorkouts());
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Workout data could not be loaded.";
    return NextResponse.json({ message }, { status: 502 });
  }
}
