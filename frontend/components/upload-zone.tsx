"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import { uploadPdfFile } from "@/lib/api";

interface UploadZoneProps {
  onUploadSuccess: (fileName: string, fileSize: number) => void;
}

export function UploadZone({ onUploadSuccess }: UploadZoneProps) {
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

    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
      setError("Chỉ hỗ trợ tải lên tài liệu định dạng PDF.");
      return;
    }

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
        onUploadSuccess(file.name, file.size);
      }, 800);
    } catch (err: any) {
      setError(err.message || "Tải tài liệu lên thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto z-10 px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !loading && !success && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center min-h-[260px] border rounded-[2rem] p-8 text-center cursor-pointer transition-all duration-300 glass-panel ${
          dragActive
            ? "border-indigo-500 bg-indigo-500/5 ring-4 ring-indigo-500/10 scale-[1.01]"
            : "border-white/10 hover:bg-white/[0.02] hover:border-white/20 shadow-2xl"
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

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div 
              key="empty-upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <div className="relative p-4.5 bg-white/5 rounded-2xl text-zinc-300 border border-white/5 mb-5 shadow-lg group-hover:scale-105 transition-transform">
                <Upload size={24} className="text-indigo-400" />
                <div className="absolute inset-0 bg-indigo-500/10 blur-md rounded-full -z-10" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-1.5">Kéo thả tệp PDF vào đây</h3>
              <p className="text-xs text-zinc-400 mb-1">hoặc click để chọn từ thư mục của bạn</p>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider bg-white/5 px-3 py-1 rounded-full border border-white/5 mt-4">
                PDF tối đa 20MB
              </span>
            </motion.div>
          ) : (
            <motion.div 
              key="file-ready"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center w-full"
            >
              <div className="p-4 bg-white/5 rounded-2xl text-zinc-200 border border-white/5 mb-4">
                <FileText size={30} className="text-purple-400" />
              </div>
              <h4 className="font-semibold text-sm text-white break-all max-w-sm mb-1">{file.name}</h4>
              <p className="text-[11px] text-zinc-400 font-bold mb-6">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>

              {loading && (
                <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-xs mb-2 bg-cyan-400/5 px-4 py-2 border border-cyan-400/10 rounded-full animate-pulse">
                  <Loader2 size={13} className="animate-spin" />
                  Đang lập chỉ mục tài liệu...
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs mb-2 bg-emerald-400/5 px-4 py-2 border border-emerald-400/10 rounded-full">
                  <div className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Đã tải lên thành công!
                </div>
              )}

              {!loading && !success && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  className="w-full max-w-[200px] mt-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  Bắt đầu phân tích
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 text-red-400 bg-red-500/5 border border-red-500/10 rounded-full px-4 py-2 text-xs font-semibold mt-4 justify-center max-w-md mx-auto"
        >
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </motion.div>
      )}
    </div>
  );
}
