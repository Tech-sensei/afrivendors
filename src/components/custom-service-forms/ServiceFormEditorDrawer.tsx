"use client";

import type { Dispatch, SetStateAction } from "react";
import { DollarSign, MapPin } from "lucide-react";
import { Drawer, DrawerSection } from "@/app/(dashboard)/Drawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { MockVendor } from "@/types/misc";
import type { ServiceFormDraft } from "@/types/customServiceForms";
import { formField } from "./form-field-styles";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  formData: ServiceFormDraft;
  setFormData: Dispatch<SetStateAction<ServiceFormDraft>>;
  categories: string[];
  availableServices: string[];
  filteredVendors: MockVendor[];
  onSubmit: () => void;
  isValid: boolean;
};

export function ServiceFormEditorDrawer({
  open,
  onOpenChange,
  isEditMode,
  formData,
  setFormData,
  categories,
  availableServices,
  filteredVendors,
  onSubmit,
  isValid,
}: Props) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Edit Custom Service Form" : "New Custom Service Form"}
      description="Request custom services from verified vendors"
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
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    service: "",
                    vendorId: "",
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
            </div>

            <div>
              <Label htmlFor="service" className={formField.label}>
                Service *
              </Label>
              <Select
                value={formData.service}
                onValueChange={(value) =>
                  setFormData({ ...formData, service: value, vendorId: "" })
                }
                disabled={!formData.category}
              >
                <SelectTrigger id="service" className={formField.selectTrigger}>
                  <SelectValue
                    placeholder={
                      formData.category
                        ? "Select service"
                        : "Select category first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DrawerSection>

      <DrawerSection title="Vendor selection">
        <div className="space-y-4">
          <div>
            <Label className={formField.label}>Send Request To *</Label>
            <RadioGroup
              value={formData.vendorSelectionType}
              onValueChange={(value: "specific" | "all") => {
                setFormData({
                  ...formData,
                  vendorSelectionType: value,
                  vendorId: value === "all" ? "" : formData.vendorId,
                });
              }}
            >
              <div className="mb-3 flex items-center gap-3">
                <RadioGroupItem
                  value="specific"
                  id="specific"
                  disabled={!formData.category || !formData.service}
                />
                <Label htmlFor="specific" className={formField.labelInline}>
                  Specific Vendor
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value="all"
                  id="all"
                  disabled={!formData.category || !formData.service}
                />
                <Label htmlFor="all" className={formField.labelInline}>
                  All Vendors in Category
                </Label>
              </div>
            </RadioGroup>
            <p className={formField.hint}>
              {formData.vendorSelectionType === "all"
                ? `Your request will be sent to all ${filteredVendors.length} vendor${filteredVendors.length !== 1 ? "s" : ""} offering this service`
                : "Choose a specific vendor to send your request to"}
            </p>
          </div>

          {formData.vendorSelectionType === "specific" && (
            <div>
              <Label htmlFor="vendor" className={formField.label}>
                Select Vendor *
              </Label>
              <Select
                value={formData.vendorId}
                onValueChange={(value) =>
                  setFormData({ ...formData, vendorId: value })
                }
                disabled={!formData.category || !formData.service}
              >
                <SelectTrigger id="vendor" className={formField.selectTrigger}>
                  <SelectValue
                    placeholder={
                      formData.category && formData.service
                        ? "Choose a vendor"
                        : "Select category and service first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredVendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      <div className="flex items-center gap-2">
                        <span>{vendor.name}</span>
                        <span className="text-xs text-accent-60">
                          • {vendor.location}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className={formField.hint}>
                {filteredVendors.length} vendor
                {filteredVendors.length !== 1 ? "s" : ""} available
              </p>
            </div>
          )}
        </div>
      </DrawerSection>

      <DrawerSection title="Service details">
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
          </div>
        </div>
      </DrawerSection>

      <DrawerSection title="Budget & location">
        <div className="space-y-4">
          <div>
            <Label htmlFor="budget" className={formField.label}>
              Estimated Budget (USD) *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-60" />
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
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="isRemote"
              checked={formData.isRemote}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  isRemote: !!checked,
                  location: checked ? "" : formData.location,
                })
              }
            />
            <Label htmlFor="isRemote" className={formField.labelInline}>
              Remote/Online service
            </Label>
          </div>

          {!formData.isRemote && (
            <div>
              <Label htmlFor="location" className={formField.label}>
                Service Location *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-60" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="City, Country or specific address"
                  className={cn(formField.input, "pl-10")}
                />
              </div>
            </div>
          )}
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
            vendor regarding this service request
          </Label>
        </div>
      </DrawerSection>
    </Drawer>
  );
}
