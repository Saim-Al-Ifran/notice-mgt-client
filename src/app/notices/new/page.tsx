// components/CreateNoticeForm.tsx
"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckIcon } from "@heroicons/react/24/solid";
import api from "@/lib/axios";

/* ===== Shared Field Style ===== */
const fieldBase =
  "w-full h-11 rounded-lg border border-[#D0D5DD] bg-white px-3 text-sm text-gray-700 " +
  "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition";

/* ===== Custom Select Wrapper ===== */
function SelectField({
  children,
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...rest}
        className={`${fieldBase} appearance-none pr-10 ${className}`}
      >
        {children}
      </select>

      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
        ▼
      </span>
    </div>
  );
}

/* ===== Form Types ===== */
type CreateNoticeFormValues = {
  target: string;
  title: string;
  employeeId: string;
  employeeName: string;
  position: string;
  noticeType: string;
  publishDate: string;
  body?: string;
};

/* ===== Hardcoded employee fallback (used if user doesn't pick one) ===== */
const HARDCODED_EMPLOYEE = {
  employeeId: "EMP-2045",
  employeeName: "Sarah Khan",
  position: "HR Executive",
};

/* ===== Success Modal (inline) ===== */
function SuccessModal({
  open,
  onClose,
  message,
}: {
  open: boolean;
  onClose: () => void;
  message?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notice saved</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{message ?? "The notice was saved successfully."}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Main Form Component ===== */
export default function CreateNoticeForm() {
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateNoticeFormValues>({
    defaultValues: {
      target: "",
      title: "",
      employeeId: "",
      employeeName: "",
      position: "",
      noticeType: "",
      publishDate: "",
      body: "",
    },
  });

  const target = watch("target");

  /* ===== File Handlers ===== */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    // enforce max 5 files
    const combined = [...attachments, ...files].slice(0, 5);
    setAttachments(combined);

    // reset input so same file can be reselected if removed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setAttachments(files => files.filter((_, i) => i !== index));
  };

  /* ===== Build FormData for API ===== */
  const buildFormData = (data: CreateNoticeFormValues, status: "Published" | "Draft") => {
    const fd = new FormData();

    // Map UI fields to API expected fields
    fd.append("targetRecipient", data.target);
    fd.append("noticeTitle", data.title);

    // Use provided employee fields or fallback to hardcoded values
    const employeeId = data.employeeId?.trim() ? data.employeeId : HARDCODED_EMPLOYEE.employeeId;
    const employeeName = data.employeeName?.trim() ? data.employeeName : HARDCODED_EMPLOYEE.employeeName;
    const position = data.position?.trim() ? data.position : HARDCODED_EMPLOYEE.position;

    fd.append("employeeId", employeeId);
    fd.append("employeeName", employeeName);
    fd.append("position", position);

    fd.append("noticeType", data.noticeType);
    if (data.body) fd.append("noticeBody", data.body);
    fd.append("publishDate", data.publishDate);
    fd.append("status", status); // "Published" or "Draft"

    // Attach files under 'attachments' (backend should accept this key)
    if (attachments[0]) {
      fd.append("attachment", attachments[0]);
    }



    return fd;
  };

  /* ===== API submit ===== */
  const submitToApi = async (formData: FormData) => {
    // axios instance will set multipart headers automatically
    const res = await api.post("/api/v1/notice", formData, {
      timeout: 20000,
    });
    return res.data;
  };

  /* ===== Handlers ===== */
  const onPublish = async (data: CreateNoticeFormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const fd = buildFormData(data, "Published");
      const json = await submitToApi(fd);
      setSuccessMessage(json?.message ?? "Notice published successfully.");
      setSuccessOpen(true);
      reset();
      setAttachments([]);
    } catch (err: any) {
      console.error("Publish error:", err);
      setSubmitError(err?.response?.data?.message ?? err?.message ?? "Failed to publish notice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDraft = async (data: CreateNoticeFormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const fd = buildFormData(data, "Draft");
      const json = await submitToApi(fd);
      setSuccessMessage(json?.message ?? "Draft saved successfully.");
      setSuccessOpen(true);
      reset();
      setAttachments([]);
    } catch (err: any) {
      console.error("Save draft error:", err);
      setSubmitError(err?.response?.data?.message ?? err?.message ?? "Failed to save draft");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Create a Notice</h2>
      </div>

      {/* Sub Header */}
      <div className="px-6 py-4 bg-gray-50 border-b">
        <p className="text-sm text-gray-600">Please fill in the details below</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onPublish)} className="px-6 py-6 space-y-6">
        {/* Target */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Department(s) or Individual <span className="text-red-500">*</span>
          </label>

          <SelectField
            className="bg-gray-50"
            {...register("target", { required: "Target is required" })}
          >
            <option value="">Select target</option>
            <option value="Individual">Individual</option>
            <option value="Department">Department</option>
          </SelectField>

          {errors.target && <p className="text-xs text-red-500 mt-1">{errors.target.message}</p>}
        </div>

        {/* Notice Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notice Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Write the Title of Notice"
            className={fieldBase}
            {...register("title", { required: "Notice title is required" })}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        {/* Employee Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Employee ID <span className="text-red-500">*</span>
            </label>
            <SelectField
              {...register("employeeId", { required: "Employee ID is required" })}
            >
              <option value="">Select employee ID</option>
              {/* Example options — replace with dynamic list if available */}
              <option value={HARDCODED_EMPLOYEE.employeeId}>{HARDCODED_EMPLOYEE.employeeId}</option>
            </SelectField>
            {errors.employeeId && <p className="text-xs text-red-500 mt-1">{errors.employeeId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter employee full name"
              className={fieldBase}
              {...register("employeeName", {
                required: "Employee name is required",
              })}
              defaultValue={HARDCODED_EMPLOYEE.employeeName}
            />
            {errors.employeeName && <p className="text-xs text-red-500 mt-1">{errors.employeeName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position <span className="text-red-500">*</span>
            </label>
            <SelectField
              {...register("position", { required: "Position is required" })}
            >
              <option value="">Select employee department</option>
              <option value={HARDCODED_EMPLOYEE.position}>{HARDCODED_EMPLOYEE.position}</option>
            </SelectField>
            {errors.position && <p className="text-xs text-red-500 mt-1">{errors.position.message}</p>}
          </div>
        </div>

        {/* Notice Type & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notice Type <span className="text-red-500">*</span>
            </label>
            <SelectField
              {...register("noticeType", { required: "Notice type is required" })}
            >
              <option value="">Select Notice Type</option>
              <option value="Warning / Disciplinary">Warning / Disciplinary</option>
              <option value="Performance Improvement">Performance Improvement</option>
              <option value="Appreciation / Recognition">Appreciation / Recognition</option>
              <option value="Attendance / Leave Issue">Attendance / Leave Issue</option>
              <option value="Payroll / Compensation">Payroll / Compensation</option>
              <option value="Contract / Role Update">Contract / Role Update</option>
              <option value="Advisory / Personal Reminder">Advisory / Personal Reminder</option>
            </SelectField>
            {errors.noticeType && <p className="text-xs text-red-500 mt-1">{errors.noticeType.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Publish Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={fieldBase}
              {...register("publishDate", { required: "Publish date is required" })}
            />
            {errors.publishDate && <p className="text-xs text-red-500 mt-1">{errors.publishDate.message}</p>}
          </div>
        </div>

        {/* Notice Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notice Body</label>
          <textarea rows={4} placeholder="Write the details about notice" className={`${fieldBase} h-auto py-3`} {...register("body")} />
        </div>

        {/* Upload Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Upload Attachments (optional)</label>

          <div className="border-2 border-dashed border-green-400 rounded-xl p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.png,.pdf"
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
            />

            <label htmlFor="file-upload" className="cursor-pointer text-sm font-medium text-green-600">
              Upload attachments
            </label>

            <span className="text-sm text-gray-600"> such as policy documents, images, or reference files</span>

            <p className="text-xs text-gray-500 mt-1">Accepted formats: JPG, PNG, PDF • Max 5 files</p>
          </div>

          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 rounded-full px-4 py-2 text-sm">
                  <span className="truncate">📎 {file.name}</span>
                  <button type="button" onClick={() => removeFile(index)} className="text-red-500 font-semibold">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {submitError && <div className="text-sm text-red-600">{submitError}</div>}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-6 border-t">
<button
  type="button"
  onClick={() => {
    reset();
    setAttachments([]);
    setSubmitError(null);
  }}
  disabled={isSubmitting}
  className="
    px-6 py-2 rounded-full text-sm font-medium
    border border-gray-300 text-gray-700
    transition-all duration-200
    hover:bg-gray-100 hover:border-gray-400
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-gray-300/40
    disabled:opacity-50 disabled:cursor-not-allowed
  "
>
  Cancel
</button>


          <button
            type="button"
            onClick={handleSubmit(onDraft)}
            disabled={isSubmitting}
            className="
              px-6 py-2 rounded-full text-sm font-medium
              border border-indigo-500 text-indigo-600
              transition-all duration-200
              hover:bg-indigo-50 hover:border-indigo-600
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-indigo-500/40
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Save as Draft
          </button>


          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition disabled:opacity-60"
            disabled={isSubmitting}
          >
            <CheckIcon className="h-5 w-5" />
            {isSubmitting ? "Saving…" : "Publish Notice"}
          </button>
        </div>
      </form>

      <SuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} message={successMessage} />
    </div>
  );
}
