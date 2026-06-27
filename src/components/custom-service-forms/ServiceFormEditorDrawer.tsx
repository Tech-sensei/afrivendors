"use client";

import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { ImagePlus, Loader2, MapPin, PoundSterling } from "lucide-react";
import { Drawer, DrawerSection } from "@/app/(dashboard)/Drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CustomOrderDraft } from "@/types/customOrders";
import type { PublicCategory } from "@/types/category";
import { formField } from "./form-field-styles";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  formData: CustomOrderDraft;
  setFormData: Dispatch<SetStateAction<CustomOrderDraft>>;
  categories: PublicCategory[];
  selectedCategoryVendorCount: number;
  onSubmit: () => void;
  isValid: boolean;
  isSubmitting?: boolean;
  fieldErrors?: Partial<Record<keyof CustomOrderDraft, string>>;
};

export function ServiceFormEditorDrawer({
  open,
  onOpenChange,
  isEditMode,
  formData,
  setFormData,
  categories,
  selectedCategoryVendorCount,
  onSubmit,
  isValid,
  isSubmitting = false,
  fieldErrors = {},
}: Props) {
  const err = (key: keyof CustomOrderDraft) =>
    fieldErrors[key] ? (
      <p className="mt-1 font-unageo text-sm text-red-600">{fieldErrors[key]}</p>
    ) : null;

  const selectedCategoryName =
    categories.find((item) => item.id === formData.categoryId)?.name ?? "";

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setFormData({ ...formData, image: file, imageUrl: "" });
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Edit custom order" : "New custom order"}
      description="Choose a category — all vendors in that category can send you quotes"
      size="lg"
      type={isEditMode ? "edit" : "create"}
      footer={
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-[18px] border-accent-20"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!isValid || isSubmitting}
            className={cn(
              "h-11 rounded-[18px] px-6 font-semibold",
              isValid && !isSubmitting
                ? "bg-primary-100 text-white hover:bg-primary-100/90"
                : "cursor-not-allowed bg-accent-30 text-accent-60",
            )}
            onClick={onSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : isEditMode ? (
              "Save Changes"
            ) : (
              "Submit Request"
            )}
          </Button>
        </div>
      }
    >
      <DrawerSection title="Request details">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className={formField.label}>
              Request title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Wedding makeup and gele styling"
              className={formField.input}
            />
            {err("title")}
          </div>

          <div>
            <Label htmlFor="category" className={formField.label}>
              Category *
            </Label>
            <Select
              value={formData.categoryId ? String(formData.categoryId) : ""}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  categoryId: Number(value),
                });
              }}
            >
              <SelectTrigger id="category" className={formField.selectTrigger}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {err("categoryId")}
            {formData.categoryId ? (
              <p className={cn(formField.hint, "mt-2")}>
                Your request will be sent to all{" "}
                <span className="font-semibold text-secondary-000">
                  {selectedCategoryVendorCount} vendor
                  {selectedCategoryVendorCount !== 1 ? "s" : ""}
                </span>{" "}
                in {selectedCategoryName}.
              </p>
            ) : (
              <p className={formField.hint}>
                Select a category to see how many vendors will receive your
                request.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className={formField.label}>
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe what you need in detail..."
              rows={4}
              className={formField.textarea}
            />
            {err("description")}
          </div>
        </div>
      </DrawerSection>

      <DrawerSection title="Schedule">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="date" className={formField.label}>
              Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className={formField.input}
            />
            {err("date")}
          </div>

          <div>
            <Label htmlFor="time" className={formField.label}>
              Time *
            </Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className={formField.input}
            />
            {err("time")}
          </div>
        </div>
      </DrawerSection>

      <DrawerSection title="Budget & location">
        <div className="space-y-4">
          <div>
            <Label htmlFor="budget" className={formField.label}>
              Budget *
            </Label>
            <div className="relative">
              <PoundSterling className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-60" />
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                placeholder="0.00"
                className={cn(formField.input, "pl-10")}
              />
            </div>
            {err("budget")}
          </div>

          <div>
            <Label htmlFor="location" className={formField.label}>
              Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-60" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="City, area, or full address"
                className={cn(formField.input, "pl-10")}
              />
            </div>
            {err("location")}
          </div>

          <div>
            <Label htmlFor="priority" className={formField.label}>
              Priority
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value: CustomOrderDraft["priority"]) =>
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger id="priority" className={formField.selectTrigger}>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            {err("priority")}
          </div>
        </div>
      </DrawerSection>

      <DrawerSection title="Image">
        <div className="space-y-4">
          <div>
            <Label htmlFor="image" className={formField.label}>
              Upload image
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={formField.input}
              />
              <ImagePlus className="h-5 w-5 shrink-0 text-accent-60" />
            </div>
            {formData.image ? (
              <p className={cn(formField.hint, "mt-2")}>{formData.image.name}</p>
            ) : null}
            {err("image")}
          </div>

          <div>
            <Label htmlFor="imageUrl" className={formField.label}>
              Image URL
            </Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  imageUrl: e.target.value,
                  image: null,
                })
              }
              placeholder="https://..."
              className={formField.input}
              disabled={Boolean(formData.image)}
            />
            {err("imageUrl")}
          </div>
        </div>
      </DrawerSection>
    </Drawer>
  );
}
