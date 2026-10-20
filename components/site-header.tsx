"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFitLog } from "@/components/fit-log-provider";

export function SiteHeader() {
  const pathname = usePathname();
  const { planIds, savedIds } = useFitLog();
  const workoutActive = pathname === "/" || pathname.startsWith("/workout/");
  const planActive = pathname.startsWith("/my-plan");

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="FitLog home">
          <img className="brand-icon" src="/assets/logo.png" alt="" />
          <span>FITLOG</span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <Link className={workoutActive ? "active" : ""} href="/">
            Workout
          </Link>
          <Link className={planActive ? "active" : ""} href="/my-plan">
            My Plan
          </Link>
        </nav>

        <div className="header-badges">
          <Link className="count-badge plan-badge" href="/my-plan">
            <span>PLAN</span>
            <strong>{planIds.length}</strong>
          </Link>
          <Link className="count-badge saved-badge" href="/my-plan">
            <span>SAVED</span>
            <strong>{savedIds.length}</strong>
          </Link>
        </div>
      </div>
    </header>
  );
}
