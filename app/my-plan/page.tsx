"use client";

import Link from "next/link";
import { useState } from "react";
import { LoadingState } from "@/components/loading-state";
import { useFitLog } from "@/components/fit-log-provider";

type PlanTab = "plan" | "saved";

export default function MyPlanPage() {
  const [activeTab, setActiveTab] = useState<PlanTab>("plan");
  const {
    workouts,
    loading,
    error,
    planIds,
    savedIds,
    doneIds,
    removeFromPlan,
    removeSaved,
    markAsDone,
  } = useFitLog();

  const planWorkouts = planIds
    .map((id) => workouts.find((workout) => workout.id === id))
    .filter((workout) => workout !== undefined);
  const savedWorkouts = savedIds
    .map((id) => workouts.find((workout) => workout.id === id))
    .filter((workout) => workout !== undefined);
  const visibleWorkouts = activeTab === "plan" ? planWorkouts : savedWorkouts;
  const totalMinutes = planWorkouts.reduce(
    (total, workout) => total + workout.duration,
    0,
  );
  const totalCalories = planWorkouts.reduce(
    (total, workout) => total + workout.caloriesBurned,
    0,
  );

  return (
    <section className="plan-section page-shell">
      <div className="plan-heading">
        <div>
          <p className="eyebrow"><span /> YOUR TRAINING, TRACKED</p>
          <h1>MY PLAN</h1>
          <p className="section-subtitle">
            Cap of five lifts for today. Finish them, then load more.
          </p>
        </div>
        <div className="plan-date">
          <span>TRAINING LOG</span>
          <strong>TODAY / 01</strong>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span>EXERCISES</span>
          <strong>{planWorkouts.length}<small> / 05</small></strong>
        </div>
        <div className="metric-card">
          <span>MINUTES</span>
          <strong>{totalMinutes}<small> MIN</small></strong>
        </div>
        <div className="metric-card">
          <span>CALORIES</span>
          <strong>{totalCalories}<small> KCAL</small></strong>
        </div>
      </div>

      <div className="plan-toolbar">
        <div className="plan-tabs" role="tablist" aria-label="Workout lists">
          <button
            className={activeTab === "plan" ? "active" : ""}
            id="tab-plan"
            role="tab"
            aria-selected={activeTab === "plan"}
            aria-controls="plan-list"
            type="button"
            onClick={() => setActiveTab("plan")}
          >
            TODAY&apos;S PLAN <span>{planIds.length}</span>
          </button>
          <button
            className={activeTab === "saved" ? "active" : ""}
            id="tab-saved"
            role="tab"
            aria-selected={activeTab === "saved"}
            aria-controls="plan-list"
            type="button"
            onClick={() => setActiveTab("saved")}
          >
            SAVED <span>{savedIds.length}</span>
          </button>
        </div>
        <Link className="text-link" href="/#library">+ ADD A WORKOUT</Link>
      </div>

      <div id="plan-list" role="tabpanel" aria-labelledby={activeTab === "plan" ? "tab-plan" : "tab-saved"}>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <p className="error-message" role="alert">{error}</p>
        ) : visibleWorkouts.length === 0 ? (
          <div className="empty-state">
            <span className="empty-mark" aria-hidden="true">∅</span>
            <p className="eyebrow"><span /> {activeTab === "plan" ? "REST DAY?" : "KEEP THE GOOD ONES CLOSE"}</p>
            <h2>NOTHING HERE YET</h2>
            <p>Browse the library and add a lift to get today moving.</p>
            <Link className="button button-primary" href="/#library">GO TO WORKOUTS <span aria-hidden="true">↗</span></Link>
          </div>
        ) : (
          <div className="plan-list">
            {visibleWorkouts.map((workout) => {
              const isDone = doneIds.includes(workout.id);
              return (
                <article className={`plan-card${isDone ? " is-done" : ""}`} key={workout.id}>
                  <img
                    className="plan-thumb"
                    src={workout.image}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/assets/banner.png";
                    }}
                  />
                  <div className="plan-card-main">
                    <div className="tag-list">
                      {workout.muscleGroups.slice(0, 2).map((group) => (
                        <span className="tag" key={group}>{group}</span>
                      ))}
                    </div>
                    <h2>{workout.name}</h2>
                    <p className="equipment-line">{workout.equipment}</p>
                    <div className="workout-stats">
                      <span><span aria-hidden="true">◷</span> {workout.duration} min</span>
                      <span><span aria-hidden="true">ϟ</span> {workout.caloriesBurned} kcal</span>
                      <span><span aria-hidden="true">★</span> {workout.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="plan-card-actions">
                    <Link className="button button-small button-secondary" href={`/workout/${workout.id}`}>
                      VIEW DETAILS
                    </Link>
                    {activeTab === "plan" && (
                      <button
                        className="button button-small button-done"
                        type="button"
                        onClick={() => markAsDone(workout.id)}
                        disabled={isDone}
                      >
                        {isDone ? "✓ DONE" : "✓ MARK AS DONE"}
                      </button>
                    )}
                    <button
                      className="remove-button"
                      type="button"
                      aria-label={`Remove ${workout.name} from ${activeTab === "plan" ? "today's plan" : "saved lifts"}`}
                      onClick={() =>
                        activeTab === "plan"
                          ? removeFromPlan(workout.id)
                          : removeSaved(workout.id)
                      }
                    >
                      ×
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
