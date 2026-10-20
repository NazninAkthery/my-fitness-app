"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { isWorkoutList } from "@/lib/api";
import type { Workout } from "@/lib/types";

type FitLogContextValue = {
  workouts: Workout[];
  loading: boolean;
  error: string | null;
  planIds: number[];
  savedIds: number[];
  doneIds: number[];
  toast: string | null;
  addToPlan: (workout: Workout) => void;
  saveWorkout: (workout: Workout) => void;
  removeFromPlan: (workoutId: number) => void;
  removeSaved: (workoutId: number) => void;
  markAsDone: (workoutId: number) => void;
  showToast: (message: string) => void;
};

const FitLogContext = createContext<FitLogContextValue | null>(null);
const STORAGE_KEY = "fitlog-data";
const PLAN_LIMIT = 5;

function readIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (id): id is number => typeof id === "number" && Number.isInteger(id),
  );
}

export function FitLogProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planIds, setPlanIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [doneIds, setDoneIds] = useState<number[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadWorkouts() {
      try {
        const response = await fetch("/api/workouts");
        const payload: unknown = await response.json();
        if (!response.ok) {
          const message =
            payload && typeof payload === "object" && "message" in payload
              ? String(payload.message)
              : "The workout list could not be loaded.";
          throw new Error(message);
        }
        if (!isWorkoutList(payload)) {
          throw new Error("The workout list could not be read.");
        }
        if (active) setWorkouts(payload);
      } catch (loadError) {
        console.error("Unable to load FitLog workouts.", loadError);
        if (active) setError("Workouts could not be loaded. Please try again later.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadWorkouts();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      if (storedValue) {
        const storedData: unknown = JSON.parse(storedValue);
        if (storedData && typeof storedData === "object") {
          const data = storedData as Record<string, unknown>;
          setPlanIds(readIds(data.planIds));
          setSavedIds(readIds(data.savedIds));
          setDoneIds(readIds(data.doneIds));
        }
      }
    } catch (storageError) {
      console.error("Unable to read FitLog data from localStorage.", storageError);
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ planIds, savedIds, doneIds }),
      );
    } catch (storageError) {
      console.error("Unable to save FitLog data to localStorage.", storageError);
    }
  }, [doneIds, planIds, savedIds, storageReady]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(message: string) {
    setToast(message);
  }

  function addToPlan(workout: Workout) {
    if (planIds.includes(workout.id)) {
      showToast("This lift is already in today's plan.");
      return;
    }
    if (planIds.length >= PLAN_LIMIT) {
      showToast("Today's plan is full. Finish a lift to make room.");
      return;
    }
    setPlanIds((current) => [...current, workout.id]);
    showToast("Added to today's plan.");
  }

  function saveWorkout(workout: Workout) {
    if (savedIds.includes(workout.id)) {
      showToast("This lift is already saved.");
      return;
    }
    setSavedIds((current) => [...current, workout.id]);
    showToast("Saved for later.");
  }

  function removeFromPlan(workoutId: number) {
    setPlanIds((current) => current.filter((id) => id !== workoutId));
    setDoneIds((current) => current.filter((id) => id !== workoutId));
    showToast("Removed from today's plan.");
  }

  function removeSaved(workoutId: number) {
    setSavedIds((current) => current.filter((id) => id !== workoutId));
    showToast("Removed from saved lifts.");
  }

  function markAsDone(workoutId: number) {
    if (doneIds.includes(workoutId)) return;
    setDoneIds((current) => [...current, workoutId]);
    showToast("Lift marked as done. Nice work!");
  }

  return (
    <FitLogContext.Provider
      value={{
        workouts,
        loading,
        error,
        planIds,
        savedIds,
        doneIds,
        toast,
        addToPlan,
        saveWorkout,
        removeFromPlan,
        removeSaved,
        markAsDone,
        showToast,
      }}
    >
      {children}
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <span className="toast-check" aria-hidden="true">
            ✓
          </span>
          {toast}
        </div>
      )}
    </FitLogContext.Provider>
  );
}

export function useFitLog() {
  const context = useContext(FitLogContext);
  if (!context) {
    throw new Error("useFitLog must be used inside FitLogProvider.");
  }
  return context;
}
