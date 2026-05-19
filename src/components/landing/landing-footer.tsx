export function LandingFooter() {
  return (
    <footer className="border-t border-m-line py-8 px-10 max-w-7xl mx-auto flex items-center flex-wrap gap-4 text-xs text-m-text-3">
      <div className="m-brand-mark m-brand-mark--sm">M</div>
      <span>
        Meridian Operations Inc. · Princeton, NJ · v4.2.18 · build 0c9a142
      </span>
      <span className="m-spacer" />
      <a className="cursor-pointer">Privacy</a>
      <a className="cursor-pointer">Terms</a>
      <a className="cursor-pointer">Status</a>
      <a className="cursor-pointer">Security</a>
    </footer>
  );
}
