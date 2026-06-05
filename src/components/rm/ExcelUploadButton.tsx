"use client";

import { useRef, useState } from "react";

interface ExcelUploadButtonProps {
  endpoint: "/api/rm/upload/bench" | "/api/rm/upload/jobs";
  label: string;
  onComplete?: (result: {
    success: number;
    failed: number;
    total: number;
    message?: string;
  }) => void;
}

export default function ExcelUploadButton({
  endpoint,
  label,
  onComplete,
}: ExcelUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleFile = async (file: File) => {
    setLoading(true);
    setMsg("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(endpoint, {
        method: "POST",
        body: form,
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      const text = `✓ ${json.success}/${json.total} imported`;
      setMsg(text);
      onComplete?.(json);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border border-red-600 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
      >
        {loading ? "Uploading..." : label}
      </button>
      {msg && (
        <span className="text-sm text-gray-600 max-sm:w-full">{msg}</span>
      )}
    </div>
  );
}
