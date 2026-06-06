import Link from "next/link";
import { MapPin } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state/empty-state";

export default function AppNotFound() {
  return (
    <div className="m-page">
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Error 404</span>
          <h1 className="m-page__h">Page not found</h1>
        </div>
      </div>
      <div className="m-page__body">
        <EmptyState
          icon={MapPin}
          heading="You wandered off campus"
          body="This page doesn't exist in the system. It may have been moved or the link is incorrect."
          action={
            <Link href="/" className="m-btn m-btn--primary">
              Go home
            </Link>
          }
        />
      </div>
    </div>
  );
}
