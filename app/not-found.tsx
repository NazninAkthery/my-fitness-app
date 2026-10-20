import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found page-shell">
      <p className="eyebrow"><span /> PAGE NOT FOUND</p>
      <h1>WRONG TURN.<br />RIGHT BACK.</h1>
      <p>The page you&apos;re looking for isn&apos;t in the workout log.</p>
      <Link className="button button-primary" href="/">BACK TO WORKOUTS <span aria-hidden="true">↗</span></Link>
    </section>
  );
}
