"use client";

import type { Dispatch, SetStateAction } from "react";
import { MapPin, PoundSterling } from "lucide-react";
import { Drawer, DrawerSection } from "@/app/(dashboard)/Drawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { MockVendor } from "@/types/misc";
import type { CustomOrderDraft } from "@/types/customOrders";
import { formField } from "./form-field-styles";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  formData: CustomOrderDraft;
  setFormData: Dispatch<SetStateAction<CustomOrderDraft>>;
  categories: string[];
  vendorsInCategory: MockVendor[];
  onSubmit: () => void;
  isValid: boolean;
  fieldErrors?: Partial<Record<keyof CustomOrderDraft, string>>;
};

export function ServiceFormEditorDrawer({
  open,
  onOpenChange,
  isEditMode,
  formData,
  setFormData,
  categories,
  vendorsInCategory,
  onSubmit,
  isValid,
  fieldErrors = {},
}: Props) {
  const err = (key: keyof CustomOrderDraft) =>
    fieldErrors[key] ? (
      <p className="mt-1 font-unageo text-sm text-red-600">{fieldErrors[key]}</p>
    ) : null;
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
            disabled={!isValid}
            className={cn(
              "h-11 rounded-[18px] px-6 font-semibold",
              isValid
                ? "bg-primary-100 text-white hover:bg-primary-100/90"
                : "cursor-not-allowed bg-accent-30 text-accent-60",
            )}
            onClick={onSubmit}
          >
            {isEditMode ? "Save Changes" : "Submit Request"}
          </Button>
        </div>
      }
    >
      <DrawerSection title="Request details">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className={formField.label}>
              Request Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Box Braids for Birthday Event"
              className={formField.input}
            />
            {err("title")}
          </div>

          <div>
            <Label htmlFor="category" className={formField.label}>
              Category *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  category: value,
                });
              }}
            >
              <SelectTrigger id="category" className={formField.selectTrigger}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {err("category")}
            {formData.category ? (
              <p className={cn(formField.hint, "mt-2")}>
                Your request will be sent to all{" "}
                <span className="font-semibold text-secondary-000">
                  {vendorsInCategory.length} vendor
                  {vendorsInCategory.length !== 1 ? "s" : ""}
                </span>{" "}
                in {formData.category}. Describe exactly what you need below —
                no fixed service menu required.
              </p>
            ) : (
              <p className={formField.hint}>
                Select a category to see how many vendors will receive your
                request.
              </p>
            )}
          </div>
        </div>
      </DrawerSection>

      <DrawerSection title="What you need">
        <div>
          <Label htmlFor="description" className={formField.label}>
            Description & Scope *
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
          <p className={formField.hint}>
            Be specific about your requirements, preferences, and any special
            considerations
          </p>
          {err("description")}
        </div>
      </DrawerSection>

      <DrawerSection title="Schedule">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox
              id="flexibleDates"
              checked={formData.isFlexibleDates}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isFlexibleDates: !!checked })
              }
            />
            <Label htmlFor="flexibleDates" className={formField.labelInline}>
              I have flexible dates
            </Label>
          </div>

          {formData.isFlexibleDates ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="flexibleStart" className={formField.label}>
                  Start Date *
                </Label>
                <Input
                  id="flexibleStart"
                  type="date"
                  value={formData.flexibleStart}
                  onChange={(e) =>
                    setFormData({ ...formData, flexibleStart: e.target.value })
                  }
                  className={formField.input}
                />
              </div>
              <div>
                <Label htmlFor="flexibleEnd" className={formField.label}>
                  End Date *
                </Label>
                <Input
                  id="flexibleEnd"
                  type="date"
                  value={formData.flexibleEnd}
                  onChange={(e) =>
                    setFormData({ ...formData, flexibleEnd: e.target.value })
                  }
                  className={formField.input}
                />
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="preferredDate" className={formField.label}>
                Preferred Date *
              </Label>
              <Input
                id="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={(e) =>
                  setFormData({ ...formData, preferredDate: e.target.value })
                }
                className={formField.input}
              />
            </div>
          )}

          <div>
            <Label htmlFor="preferredTime" className={formField.label}>
              Preferred Time Window *
            </Label>
            <Select
              value={formData.preferredTime}
              onValueChange={(value) =>
                setFormData({ ...formData, preferredTime: value })
              }
            >
              <SelectTrigger
                id="preferredTime"
                className={formField.selectTrigger}
              >
                <SelectValue placeholder="Select time window" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Morning">Morning (8 AM - 12 PM)</SelectItem>
                <SelectItem value="Afternoon">
                  Afternoon (12 PM - 5 PM)
                </SelectItem>
                <SelectItem value="Evening">Evening (5 PM - 9 PM)</SelectItem>
                <SelectItem value="Flexible">Flexible / Anytime</SelectItem>
              </SelectContent>
            </Select>
            {err("preferredTime")}
          </div>
          {err("preferredDate")}
        </div>
      </DrawerSection>

      <DrawerSection title="Budget & location">
        <div className="space-y-4">
          <div>
            <Label htmlFor="budget" className={formField.label}>
              Estimated Budget (GBP) *
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
            <p className={formField.hint}>
              Vendors will use this as guidance when preparing quotes
            </p>
            {err("budget")}
          </div>

          <div>
            <Label htmlFor="location" className={formField.label}>
              Service location *
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
        </div>
      </DrawerSection>

      <DrawerSection title="Contact & preferences">
        <div className="space-y-4">
          <div>
            <Label htmlFor="customerName" className={formField.label}>
              Your Name *
            </Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              placeholder="Enter your full name"
              className={formField.input}
            />
            <p className={formField.hint}>
              Vendors will contact you through chat for further details
            </p>
            {err("customerName")}
          </div>

          <div>
            <Label className={formField.label}>Urgency Level</Label>
            <RadioGroup
              value={formData.urgency}
              onValueChange={(value: "normal" | "priority") =>
                setFormData({ ...formData, urgency: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal" className={formField.labelInline}>
                  Normal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="priority" id="priority" />
                <Label htmlFor="priority" className={formField.labelInline}>
                  Priority
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="allowMultipleQuotes"
              checked={formData.allowMultipleQuotes}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, allowMultipleQuotes: !!checked })
              }
            />
            <Label
              htmlFor="allowMultipleQuotes"
              className={formField.labelInline}
            >
              Allow multiple quotes from different vendors
            </Label>
          </div>
        </div>
      </DrawerSection>

      <DrawerSection>
        <div className="flex items-start gap-3">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, agreeToTerms: !!checked })
            }
          />
          <Label htmlFor="agreeToTerms" className={formField.labelInline}>
            I agree to receive quotes and communications from the selected
            vendor regarding this custom order
          </Label>
        </div>
        {err("agreeToTerms")}
      </DrawerSection>
    </Drawer>
  );
}
