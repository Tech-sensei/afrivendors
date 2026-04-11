"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ServiceFormEmptyState } from "@/components/custom-service-forms/ServiceFormEmptyState";
import { ServiceFormListCard } from "@/components/custom-service-forms/ServiceFormListCard";
import { ServiceFormDetailsDrawer } from "@/components/custom-service-forms/ServiceFormDetailsDrawer";
import { ServiceFormEditorDrawer } from "@/components/custom-service-forms/ServiceFormEditorDrawer";
import {
  CloseServiceFormDialog,
  DeleteServiceFormDialog,
} from "@/components/custom-service-forms/ServiceFormConfirmDialogs";
import { mockServiceForms } from "@/data/mockServiceForms";
import { vendors } from "@/data/vendorsData";
import type { ServiceFormDraft } from "@/types/customServiceForms";
import type {
  ServiceForm,
  ServiceFormStatus,
} from "@/types/customServiceForms";

const categories = Array.from(new Set(vendors.map((v) => v.category)));

const emptyDraft = (): ServiceFormDraft => ({
  title: "",
  category: "",
  service: "",
  vendorId: "",
  vendorSelectionType: "specific",
  description: "",
  attachments: [],
  preferredDate: "",
  isFlexibleDates: false,
  flexibleStart: "",
  flexibleEnd: "",
  preferredTime: "",
  budget: "",
  location: "",
  isRemote: false,
  customerName: "Amara Okonkwo",
  urgency: "normal",
  allowMultipleQuotes: false,
  agreeToTerms: false,
});

export default function CustomServiceFormsPage() {
  const [forms, setForms] = useState<ServiceForm[]>(mockServiceForms);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [newFormOpen, setNewFormOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<ServiceForm | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);
  const [formToClose, setFormToClose] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState<ServiceFormDraft>(emptyDraft);

  const filteredVendors = vendors.filter((vendor) => {
    if (formData.category && vendor.category !== formData.category) return false;
    if (formData.service) {
      const hasService = vendor.services.some((s) => s.name === formData.service);
      if (!hasService) return false;
    }
    return true;
  });

  const availableServices = formData.category
    ? Array.from(
        new Set(
          vendors
            .filter((v) => v.category === formData.category)
            .flatMap((v) => v.services.map((s) => s.name)),
        ),
      )
    : [];

  const handleViewDetails = (form: ServiceForm) => {
    setSelectedForm(form);
    setViewDetailsOpen(true);
  };

  const handleNewForm = () => {
    setIsEditMode(false);
    setFormData(emptyDraft());
    setNewFormOpen(true);
  };

  const handleEditForm = (form: ServiceForm) => {
    setIsEditMode(true);
    setSelectedForm(form);
    setFormData({
      title: form.title,
      category: form.category,
      service: form.service,
      vendorId: form.vendorId,
      vendorSelectionType: form.isOpenToAllVendors ? "all" : "specific",
      description: form.description,
      attachments: form.attachments,
      preferredDate: form.preferredDate,
      isFlexibleDates: !!form.flexibleDates,
      flexibleStart: form.flexibleDates?.start || "",
      flexibleEnd: form.flexibleDates?.end || "",
      preferredTime: form.preferredTime,
      budget: form.budget.toString(),
      location: form.location,
      isRemote: form.isRemote,
      customerName: form.customerName,
      urgency: form.urgency,
      allowMultipleQuotes: form.allowMultipleQuotes,
      agreeToTerms: true,
    });
    setViewDetailsOpen(false);
    setNewFormOpen(true);
  };

  const handleDuplicate = (form: ServiceForm) => {
    setIsEditMode(false);
    setFormData({
      title: `${form.title} (Copy)`,
      category: form.category,
      service: form.service,
      vendorId: form.vendorId,
      vendorSelectionType: form.isOpenToAllVendors ? "all" : "specific",
      description: form.description,
      attachments: [],
      preferredDate: "",
      isFlexibleDates: !!form.flexibleDates,
      flexibleStart: "",
      flexibleEnd: "",
      preferredTime: form.preferredTime,
      budget: form.budget.toString(),
      location: form.location,
      isRemote: form.isRemote,
      customerName: form.customerName,
      urgency: form.urgency,
      allowMultipleQuotes: form.allowMultipleQuotes,
      agreeToTerms: false,
    });
    setViewDetailsOpen(false);
    setNewFormOpen(true);
  };

  const handleCloseRequest = (formId: string) => {
    setFormToClose(formId);
    setCloseDialogOpen(true);
  };

  const confirmCloseRequest = () => {
    if (formToClose) {
      setForms(
        forms.map((f) =>
          f.id === formToClose
            ? { ...f, status: "closed" as ServiceFormStatus }
            : f,
        ),
      );
      toast.success("Custom service form closed");
      setCloseDialogOpen(false);
      setViewDetailsOpen(false);
      setFormToClose(null);
    }
  };

  const handleDeleteForm = (formId: string) => {
    setFormToDelete(formId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (formToDelete) {
      setForms(forms.filter((f) => f.id !== formToDelete));
      toast.success("Custom service form deleted");
      setDeleteDialogOpen(false);
      setViewDetailsOpen(false);
      setFormToDelete(null);
    }
  };

  const handleSubmitForm = () => {
    const isOpenToAll = formData.vendorSelectionType === "all";
    const vendor = isOpenToAll ? null : vendors.find((v) => v.id === formData.vendorId);

    if (!isOpenToAll && !vendor) return;

    const vendorCount = isOpenToAll ? filteredVendors.length : 1;
    const vendorDisplayName = isOpenToAll ? "All Vendors" : vendor!.name;

    if (isEditMode && selectedForm) {
      setForms(
        forms.map((f) =>
          f.id === selectedForm.id
            ? {
                ...f,
                title: formData.title,
                category: formData.category,
                service: formData.service,
                vendorId: isOpenToAll ? "" : formData.vendorId,
                vendorName: vendorDisplayName,
                description: formData.description,
                attachments: formData.attachments,
                preferredDate: formData.preferredDate,
                flexibleDates: formData.isFlexibleDates
                  ? {
                      start: formData.flexibleStart,
                      end: formData.flexibleEnd,
                    }
                  : undefined,
                preferredTime: formData.preferredTime,
                budget: Number.parseFloat(formData.budget),
                location: formData.location,
                isRemote: formData.isRemote,
                customerName: formData.customerName,
                urgency: formData.urgency,
                allowMultipleQuotes: formData.allowMultipleQuotes,
                isOpenToAllVendors: isOpenToAll,
              }
            : f,
        ),
      );
      toast.success("Custom service form updated");
    } else {
      const newForm: ServiceForm = {
        id: Date.now().toString(),
        title: formData.title,
        vendorId: isOpenToAll ? "" : formData.vendorId,
        vendorName: vendorDisplayName,
        category: formData.category,
        service: formData.service,
        description: formData.description,
        attachments: formData.attachments,
        preferredDate: formData.preferredDate,
        flexibleDates: formData.isFlexibleDates
          ? { start: formData.flexibleStart, end: formData.flexibleEnd }
          : undefined,
        preferredTime: formData.preferredTime,
        budget: Number.parseFloat(formData.budget),
        location: formData.location,
        isRemote: formData.isRemote,
        customerName: formData.customerName,
        urgency: formData.urgency,
        allowMultipleQuotes: formData.allowMultipleQuotes,
        status: "open",
        referenceId: `RSF-2025-${String(forms.length + 1).padStart(3, "0")}`,
        createdDate: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        isOpenToAllVendors: isOpenToAll,
      };
      setForms([newForm, ...forms]);
      toast.success(
        isOpenToAll
          ? `Request sent to ${vendorCount} vendor${vendorCount !== 1 ? "s" : ""} in ${formData.category}`
          : `Request sent to ${vendorDisplayName}`,
      );
    }

    setNewFormOpen(false);
  };

  const isFormValid = () => {
    const hasValidVendorSelection =
      formData.vendorSelectionType === "all" || formData.vendorId;
    return (
      !!formData.title &&
      !!formData.category &&
      !!formData.service &&
      !!hasValidVendorSelection &&
      !!formData.description &&
      !!(formData.preferredDate ||
        (formData.flexibleStart && formData.flexibleEnd)) &&
      !!formData.preferredTime &&
      !!formData.budget &&
      Number.parseFloat(formData.budget) > 0 &&
      !!(formData.location || formData.isRemote) &&
      !!formData.customerName &&
      formData.agreeToTerms
    );
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-unbounded text-[28px] leading-8 font-semibold text-secondary-200">
          Custom Service Forms
        </h1>
        <Button
          type="button"
          className="h-11 gap-2 rounded-[18px] bg-primary-100 px-5 font-semibold text-white hover:bg-primary-100/90"
          onClick={handleNewForm}
        >
          <Plus className="h-4 w-4" />
          New Form
        </Button>
      </div>

      {forms.length > 0 ? (
        <div className="space-y-4">
          {forms.map((form) => (
            <ServiceFormListCard
              key={form.id}
              form={form}
              onViewDetails={handleViewDetails}
              onEdit={handleEditForm}
              onDuplicate={handleDuplicate}
              onCloseRequest={handleCloseRequest}
              onDelete={handleDeleteForm}
            />
          ))}
        </div>
      ) : (
        <ServiceFormEmptyState onCreate={handleNewForm} />
      )}

      <ServiceFormDetailsDrawer
        open={viewDetailsOpen}
        onOpenChange={setViewDetailsOpen}
        form={selectedForm}
        vendors={vendors}
        onEdit={handleEditForm}
        onDuplicate={handleDuplicate}
        onCloseRequest={handleCloseRequest}
      />

      <ServiceFormEditorDrawer
        open={newFormOpen}
        onOpenChange={setNewFormOpen}
        isEditMode={isEditMode}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        availableServices={availableServices}
        filteredVendors={filteredVendors}
        onSubmit={handleSubmitForm}
        isValid={isFormValid()}
      />

      <CloseServiceFormDialog
        open={closeDialogOpen}
        onOpenChange={setCloseDialogOpen}
        onConfirm={confirmCloseRequest}
      />

      <DeleteServiceFormDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
