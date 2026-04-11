"use client";

import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onCreate: () => void;
};

export function ServiceFormEmptyState({ onCreate }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-accent-10 px-4 py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100/10">
        <FileText className="h-8 w-8 text-primary-100" />
      </div>
      <h3 className="mb-2 font-unbounded text-lg font-semibold text-secondary-000">
        No custom service forms yet
      </h3>
      <p className="mb-6 max-w-[400px] text-center text-sm text-accent-80">
        Create a custom service form to request personalized services from vendors
      </p>
      <Button
        type="button"
        className="h-11 gap-2 rounded-[18px] bg-primary-100 px-5 font-semibold text-white hover:bg-primary-100/90"
        onClick={onCreate}
      >
        <Plus className="h-4 w-4" />
        Create New Form
      </Button>
    </div>
  );
}
