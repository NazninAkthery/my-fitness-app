"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LoadingState } from "@/components/loading-state";
import { useFitLog } from "@/components/fit-log-provider";
import { WorkoutCard } from "@/components/workout-card";
import type { SortOption } from "@/lib/types";

export default function HomePage() {
  const { workouts, loading, error } = useFitLog();
  const [sortBy, setSortBy] = useState<SortOption>("duration");

  const sortedWorkouts = useMemo(
    () =>
      [...workouts].sort((first, second) => {
        if (sortBy === "calories") {
          return second.caloriesBurned - first.caloriesBurned;
        }
        if (sortBy === "rating") return second.rating - first.rating;
        return first.duration - second.duration;
      }),
    [sortBy, workouts],
  );

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow"><span /> WORKOUT LIBRARY</p>
            <h1>
              TRAIN WITH INTENT.
              <br />
              LOG EVERY SET.
            </h1>
            <p className="hero-description">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
              into today&apos;s plan, and watch the week&apos;s work add up.
            </p>
            <Link className="button button-primary" href="#library">
              BROWSE WORKOUTS <span aria-hidden="true">↘</span>
            </Link>
            <div className="hero-note">
              <span className="hero-note-line" />
              BUILT FOR THE WORK
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-art-label">01 / TRAINING FLOOR</div>
            <img src="/assets/banner.png" alt="Illustration of a strength training machine" />
            <span className="hero-art-index">F / 01</span>
          </div>
        </div>
      </section>

      <section className="library-section page-shell" id="library">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> YOUR NEXT REP STARTS HERE</p>
            <h2>THE LIBRARY</h2>
            <p className="section-subtitle">
              Twelve lifts covering every major muscle group.
            </p>
          </div>
          <label className="sort-control">
            <span>SORT BY</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
            >
              <option value="duration">Duration</option>
              <option value="calories">Calories</option>
              <option value="rating">Rating</option>
            </select>
          </label>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <p className="error-message" role="alert">{error}</p>
        ) : (
          <div className="workout-grid">
            {sortedWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
