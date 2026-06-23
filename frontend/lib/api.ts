const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export interface UploadResponse {
  success: boolean;
  fileId: string;
  message: string;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
}

export async function uploadPdfFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BACKEND_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Không thể tải tài liệu lên hệ thống.");
  }

  return response.json();
}

export async function askPdfQuestion(question: string): Promise<ChatResponse> {
  const response = await fetch(`${BACKEND_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Có lỗi xảy ra khi trò chuyện với AI.");
  }

  return response.json();
}
