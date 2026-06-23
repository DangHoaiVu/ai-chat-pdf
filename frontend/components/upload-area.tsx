"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { uploadPdfFile } from "@/lib/api";

interface UploadAreaProps {
  onUploadSuccess: () => void;
}

export function UploadArea({ onUploadSuccess }: UploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (selectedFile: File) => {
    setError(null);
    setSuccess(false);

    // 1. Validate PDF format
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
      setError("Chỉ hỗ trợ tải lên tài liệu định dạng PDF.");
      return;
    }

    // 2. Validate Size (20MB)
    const maxSize = 20 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("Kích thước tập tin vượt quá giới hạn 20MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      await uploadPdfFile(file);
      setSuccess(true);
      setTimeout(() => {
        onUploadSuccess();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Tải tài liệu lên thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed rounded-[2rem] p-8 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? "border-green bg-mint/40 scale-[1.01]"
            : "border-ink/20 bg-white/60 hover:bg-white/90 hover:border-green/50 shadow-sm"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleChange}
          disabled={loading}
        />

        {!file && (
          <div className="flex flex-col items-center animate-fade-in-up">
            <span className="p-4 bg-mint/50 rounded-full text-green mb-5 animate-float">
              <Upload size={32} />
            </span>
            <h3 className="font-serif text-xl font-bold mb-2">Kéo & thả tập tin PDF vào đây</h3>
            <p className="text-sm text-ink/55 mb-1">hoặc click để chọn tệp từ máy tính</p>
            <span className="text-xs text-ink/40 mt-3 font-semibold bg-ink/5 px-3 py-1.5 rounded-full">PDF tối đa 20MB</span>
          </div>
        )}

        {file && (
          <div className="flex flex-col items-center w-full animate-fade-in-up">
            <span className="p-4 bg-ink/5 rounded-full text-ink mb-4">
              <FileText size={36} />
            </span>
            <h4 className="font-semibold text-base text-ink break-all max-w-md mb-1">{file.name}</h4>
            <p className="text-xs text-ink/50 mb-6 font-semibold">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>

            {loading && (
              <div className="flex items-center gap-2 text-green font-semibold text-sm mb-2 animate-pulse">
                <Loader2 size={16} className="animate-spin" />
                Đang phân tích tài liệu...
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-green font-semibold text-sm mb-2">
                <CheckCircle2 size={18} />
                Hoàn thành! Đang mở cửa sổ chat...
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-coral font-semibold text-sm mb-4 px-4 py-2 bg-coral/5 rounded-2xl">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {!loading && !success && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
                className="w-full max-w-[200px] mt-2 py-3 bg-green hover:bg-green/90 text-white rounded-full font-bold shadow-md shadow-green/10 transition-all active:scale-95"
              >
                Bắt đầu phân tích
              </button>
            )}
          </div>
        )}
      </div>

      {error && !file && (
        <div className="flex items-center gap-2 text-coral font-semibold text-sm mt-4 justify-center px-4 py-2 bg-coral/5 rounded-2xl max-w-md mx-auto">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
