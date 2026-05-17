import type { ReactNode } from "react";
import { Sidebar } from "@/components/app-shell/sidebar";
import { Topbar } from "@/components/app-shell/topbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="m-app">
      <Sidebar />
      <div className="m-main">
        <Topbar />
        <div className="m-page">{children}</div>
      </div>
    </div>
  );
}
