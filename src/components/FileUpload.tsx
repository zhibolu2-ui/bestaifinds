"use client";

import { useCallback, useState, useRef } from "react";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  label?: string;
  onFiles: (files: File[]) => void;
}

export default function FileUpload({
  accept = "*/*",
  multiple = false,
  maxSizeMB = 100,
  label = "Upload from PC or Mobile",
  onFiles,
}: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) return;
      const valid: File[] = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].size <= maxSizeMB * 1024 * 1024) {
          valid.push(list[i]);
        }
      }
      if (valid.length) onFiles(valid);
    },
    [maxSizeMB, onFiles],
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      className={`relative mx-auto w-full max-w-2xl rounded-2xl border-2 border-dashed transition-all duration-300 ${
        dragging
          ? "border-primary-400 bg-primary-50/60 dark:bg-primary-900/20 scale-[1.01]"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50/30 dark:hover:bg-primary-900/10"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-4 py-14 px-8">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 flex items-center justify-center transition-transform duration-300 ${dragging ? "scale-110" : ""}`}>
          <svg className="w-8 h-8 text-primary-500 dark:text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>

        <button
          onClick={() => inputRef.current?.click()}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium text-sm shadow-md shadow-primary-200 dark:shadow-primary-900/50 hover:shadow-lg hover:from-primary-600 hover:to-primary-700 active:scale-95 transition-all"
        >
          {label}
        </button>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          or drag & drop {multiple ? "files" : "a file"} here · max {maxSizeMB}MB
        </p>
      </div>
    </div>
  );
}
