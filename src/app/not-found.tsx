import Link from "next/link";
import { BookOpen, GraduationCap, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="m-notfound">
      <div className="m-notfound__bg">
        <div className="m-notfound__grid" />
        <div className="m-notfound__watermark">404</div>
        <div className="m-notfound__orb m-notfound__orb--a" />
        <div className="m-notfound__orb m-notfound__orb--b" />
        <div className="m-notfound__orb m-notfound__orb--c" />
      </div>

      <div className="m-notfound__content">
        <div className="m-notfound__brand">M</div>
        <span className="m-notfound__badge">Error 404</span>
        <h1 className="m-notfound__heading">
          This page isn&apos;t in the catalog
        </h1>
        <p className="m-notfound__body">
          The page you&apos;re looking for may have been moved, removed, or
          never enrolled in the first place.
        </p>

        <div className="m-notfound__actions">
          <Link href="/" className="m-btn m-btn--primary">
            Back to home
          </Link>
        </div>

        <div className="m-notfound__portal-links">
          <Link href="/student/dashboard" className="m-notfound__portal-link">
            <div className="m-notfound__portal-icon">
              <GraduationCap size={16} />
            </div>
            Student portal
          </Link>
          <Link href="/instructor/dashboard" className="m-notfound__portal-link">
            <div className="m-notfound__portal-icon">
              <BookOpen size={16} />
            </div>
            Instructor portal
          </Link>
          <Link href="/admin/overview" className="m-notfound__portal-link">
            <div className="m-notfound__portal-icon">
              <LayoutDashboard size={16} />
            </div>
            Admin portal
          </Link>
        </div>
      </div>
    </div>
  );
}
