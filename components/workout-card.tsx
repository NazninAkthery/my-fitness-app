import Link from "next/link";
import type { Workout } from "@/lib/types";

export function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Link className="workout-card" href={`/workout/${workout.id}`}>
      <div className="workout-image-wrap">
        <img
          className="workout-image"
          src={workout.image}
          alt={workout.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/assets/banner.png";
          }}
        />
        <span className="card-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
      <div className="workout-card-content">
        <div className="tag-list">
          {workout.muscleGroups.slice(0, 2).map((group) => (
            <span className="tag" key={group}>
              {group}
            </span>
          ))}
        </div>
        <h3>{workout.name}</h3>
        <p className="equipment-line">{workout.equipment}</p>
        <div className="workout-stats">
          <span>
            <span aria-hidden="true">◷</span> {workout.duration} min
          </span>
          <span>
            <span aria-hidden="true">ϟ</span> {workout.caloriesBurned} kcal
          </span>
          <span>
            <span aria-hidden="true">★</span> {workout.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
