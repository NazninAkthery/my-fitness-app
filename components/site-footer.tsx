import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link className="brand footer-brand" href="/">
          <img className="brand-icon" src="/assets/logo.png" alt="" />
          <span>FITLOG</span>
        </Link>
        <p>© 2026 FitLog — Workout Library. Train hard, log honest.</p>
      </div>
    </footer>
  );
}
