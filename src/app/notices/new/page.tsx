'use client';

import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

/* ===== Shared Field Style (Image-close) ===== */
const fieldBase =
  "w-full h-11 rounded-lg border border-[#D0D5DD] bg-white px-3 text-sm text-gray-700 " +
  "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 " +
  "transition";

/* ===== Custom Select Wrapper ===== */
function SelectField({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative">
      <select
        className={`${fieldBase} appearance-none pr-10 ${className}`}
      >
        {children}
      </select>

      {/* Custom Arrow */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
        ▼
      </span>
    </div>
  );
}

export default function CreateNoticeForm() {
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments(files => files.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Create a Notice
        </h2>
      </div>

      {/* Sub Header */}
      <div className="px-6 py-4 bg-gray-50 border-b">
        <p className="text-sm text-gray-600">
          Please fill in the details below
        </p>
      </div>

      {/* Form */}
      <form className="px-6 py-6 space-y-6">
        {/* Target */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Department(s) or Individual <span className="text-red-500">*</span>
          </label>

          <SelectField className="bg-gray-50">
            <option>Individual</option>
            <option>Department</option>
          </SelectField>
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
          />
        </div>

        {/* Employee Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Employee ID <span className="text-red-500">*</span>
            </label>
            <SelectField>
              <option>Select employee designation</option>
            </SelectField>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter employee full name"
              className={fieldBase}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position <span className="text-red-500">*</span>
            </label>
            <SelectField>
              <option>Select employee department</option>
            </SelectField>
          </div>
        </div>

        {/* Notice Type & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notice Type <span className="text-red-500">*</span>
            </label>
            <SelectField>
              <option>Select Notice Type</option>
            </SelectField>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Publish Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={fieldBase}
            />
          </div>
        </div>

        {/* Notice Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notice Body
          </label>
          <textarea
            rows={4}
            placeholder="Write the details about notice"
            className={`${fieldBase} h-auto py-3`}
          />
        </div>

        {/* Upload Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Attachments (optional)
          </label>

          <div className="border-2 border-dashed border-green-400 rounded-xl p-8 text-center">
            <input
              type="file"
              multiple
              accept=".jpg,.png,.pdf"
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-sm font-medium text-green-600"
            >
              Upload
            </label>
            <span className="text-sm text-gray-600">
              {" "}nominee profile image or drag and drop
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Accepted File Type: jpg, png
            </p>
          </div>

          {/* Uploaded Files */}
          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 rounded-full px-4 py-2 text-sm"
                >
                  <span className="flex items-center gap-2">
                    📎 {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 font-semibold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            className="px-6 py-2 rounded-full border border-gray-300 text-sm text-gray-700"
          >
            Cancel
          </button>

          <button
            type="button"
            className="px-6 py-2 rounded-full border border-indigo-500 text-indigo-600 text-sm"
          >
            Save as Draft
          </button>

<button
  type="submit"
  className="
    inline-flex items-center gap-2
    px-6 py-2.5
    rounded-full
    bg-orange-500 hover:bg-orange-600
    text-white text-sm font-medium
    transition
  "
>
  <CheckIcon className="h-5 w-5" />
  <span>Publish Notice</span>
</button>

        </div>
      </form>
    </div>
  );
}
