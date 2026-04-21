"use client";

import { cn } from "@/lib/utils";
import type { HelpSupportTabId } from "@/types/support";

const tabs: { id: HelpSupportTabId; label: string }[] = [
  { id: "tickets", label: "My tickets" },
  { id: "overview", label: "Contact info" },
];

export function HelpSupportTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: HelpSupportTabId;
  onTabChange: (tab: HelpSupportTabId) => void;
}) {
  return (
    <div className="flex gap-8 border-b border-accent-20 bg-white px-5 sm:px-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative border-b-2 py-4 font-unageo text-sm font-semibold transition-colors cursor-pointer",
            activeTab === tab.id
              ? "border-primary-100 text-secondary-000"
              : "border-transparent text-accent-80 hover:text-secondary-000"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
