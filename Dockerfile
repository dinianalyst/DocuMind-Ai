# Multi-stage build for 1-Click All-in-One Deployment (Hugging Face Spaces, Render, Koyeb, Railway)
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy Backend code
COPY backend/ ./backend/

# Copy built frontend dist from builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Set working directory to backend
WORKDIR /app/backend

# Create runtime directories with write permissions (HuggingFace 7860 user)
RUN mkdir -p data/chroma_db data/uploads data/sample_docs && chmod -R 777 data

EXPOSE 7860 8000

ENV PORT=7860

# Run uvicorn on port 7860 (Hugging Face standard) or 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
