"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { LoadingState } from "@/components/loading-state";
import { useFitLog } from "@/components/fit-log-provider";

export default function WorkoutDetailsPage() {
  const params = useParams<{ id: string }>();
  const { workouts, loading, error, planIds, savedIds, addToPlan, saveWorkout } =
    useFitLog();
  const workout = workouts.find((item) => item.id === Number(params.id));

  if (loading) return <LoadingState />;
  if (error) {
    return <p className="error-message page-shell" role="alert">{error}</p>;
  }
  if (!workout) {
    return (
      <section className="not-found page-shell">
        <p className="eyebrow"><span /> WORKOUT NOT FOUND</p>
        <h1>NO LIFT BY THAT NAME.</h1>
        <Link className="button button-primary" href="/">BACK TO WORKOUTS</Link>
      </section>
    );
  }

  const alreadyPlanned = planIds.includes(workout.id);
  const planIsFull = planIds.length >= 5;
  const alreadySaved = savedIds.includes(workout.id);

  return (
    <section className="detail-section page-shell">
      <Link className="back-link" href="/">← BACK TO LIBRARY</Link>
      <div className="detail-layout">
        <div className="detail-image-panel">
          <span className="detail-image-label">FITLOG / EXERCISE {String(workout.id).padStart(2, "0")}</span>
          <img
            src={workout.image}
            alt={workout.name}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/assets/banner.png";
            }}
          />
          <span className="detail-image-foot">FORM FIRST. EVERY REP.</span>
        </div>

        <div className="detail-content">
          <div className="tag-list">
            {workout.muscleGroups.map((group) => (
              <span className="tag" key={group}>{group}</span>
            ))}
          </div>
          <p className="eyebrow detail-eyebrow"><span /> WORKOUT DETAILS</p>
          <h1>{workout.name}</h1>
          <p className="detail-description">{workout.description}</p>

          <div className="spec-panel">
            <h2>KEY SPECS</h2>
            <dl className="spec-grid">
              <div><dt>EQUIPMENT</dt><dd>{workout.equipment}</dd></div>
              <div><dt>DIFFICULTY</dt><dd>{workout.difficulty}</dd></div>
              <div><dt>SETS</dt><dd>{workout.sets}</dd></div>
              <div><dt>REPS</dt><dd>{workout.reps}</dd></div>
              <div><dt>DURATION</dt><dd>{workout.duration} min</dd></div>
              <div><dt>CALORIES</dt><dd>{workout.caloriesBurned} kcal</dd></div>
              <div><dt>RATING</dt><dd>★ {workout.rating.toFixed(1)}</dd></div>
            </dl>
          </div>

          <div className="instructions">
            <h2>INSTRUCTIONS</h2>
            <ol>
              {workout.instructions.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="detail-actions">
            <button
              className="button button-primary"
              type="button"
              onClick={() => addToPlan(workout)}
              disabled={alreadyPlanned || (planIsFull && !alreadyPlanned)}
            >
              <span aria-hidden="true">＋</span>
              {alreadyPlanned ? "IN TODAY'S PLAN" : planIsFull ? "PLAN IS FULL" : "ADD TO TODAY'S PLAN"}
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => saveWorkout(workout)}
              disabled={alreadySaved}
            >
              <span aria-hidden="true">☆</span>
              {alreadySaved ? "SAVED FOR LATER" : "SAVE FOR LATER"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
