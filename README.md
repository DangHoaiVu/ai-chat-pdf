# AI Chat PDF (Pro Version)

Một ứng dụng SaaS trí tuệ nhân tạo chuyên nghiệp cho phép tải lên tài liệu PDF và trò chuyện trực tiếp với nội dung tài liệu bằng công nghệ RAG (Retrieval-Augmented Generation) tiên tiến.

[![Frontend Deployment](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![Backend Deployment](https://img.shields.io/badge/Backend-Hugging--Face-yellow?style=flat-square&logo=huggingface)](https://huggingface.co)
[![Technology](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI-blue?style=flat-square)](#công-nghệ-sử-dụng)

---

## 🌟 Tính Năng Nổi Bật

*   **Trải nghiệm người dùng Premium**: Giao diện tối (Dark mode) hiện đại, hiệu ứng kính mờ (glassmorphism) sang trọng và chuyển cảnh mượt mà bằng Framer Motion.
*   **Trích xuất văn bản tốc độ cao**: Sử dụng thư viện PyMuPDF tối ưu để phân tích tài liệu PDF nhanh chóng và chính xác.
*   **Tìm kiếm ngữ nghĩa mạnh mẽ**: Cơ sở dữ liệu vector ChromaDB kết hợp mô hình ONNX Embeddings (`ONNXMiniLM_L6_V2`) chạy trực tiếp trên server giúp tối ưu chi phí và tăng tốc độ xử lý.
*   **Triển khai đám mây tối ưu**:
    *   **Frontend**: Next.js 16 được xuất bản tĩnh (Static Export) chạy trên hạ tầng mạng toàn cầu của Vercel (tốc độ phản hồi cực nhanh).
    *   **Backend**: API FastAPI RAG chạy trên Docker Container của Hugging Face Spaces hoàn toàn miễn phí.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
*   **Framework**: Next.js 16 (App Router, Turbopack)
*   **Styling**: Tailwind CSS v4
*   **Animation**: Framer Motion
*   **Icons**: Lucide React

### Backend
*   **API Framework**: FastAPI (Python)
*   **PDF Parser**: PyMuPDF (fitz)
*   **Vector Database**: ChromaDB
*   **Embeddings**: ONNX MiniLM-L6-v2 (Local Embeddings)
*   **LLM Integration**: Google Gemini API (`gemini-2.5-flash`)

---

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local Development)

### 1. Cấu hình Backend
Di chuyển vào thư mục backend và cài đặt môi trường:
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Trên Windows
source venv/bin/activate # Trên macOS/Linux
pip install -r requirements.txt
```
Tạo tệp `.env` trong thư mục `backend` và thêm khóa API của bạn:
```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
FRONTEND_URL=http://localhost:3000
```
Chạy server API:
```bash
uvicorn app.main:app --reload --port 8000
```

### 2. Cấu hình Frontend
Di chuyển vào thư mục frontend và cài đặt dependencies:
```bash
cd frontend
npm install
```
Tạo tệp `.env.local` trong thư mục `frontend`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
Chạy môi trường phát triển:
```bash
npm run dev
```
Truy cập [http://localhost:3000](http://localhost:3000) trên trình duyệt.

---

## 🚢 Triển Khai (Deployment)

*   **Backend**: Được đóng gói Docker thông qua tệp `Dockerfile` và triển khai tự động trên Hugging Face Spaces.
*   **Frontend**: Cấu hình chế độ static export (`output: "export"`) và triển khai lên Vercel thông qua cấu hình định tuyến thông minh trong `vercel.json`.
