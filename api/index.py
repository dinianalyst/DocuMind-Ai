import sys
import os

# Add backend to Python path so `app.*` imports resolve correctly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app  # noqa: F401 — Vercel ASGI handler picks this up
