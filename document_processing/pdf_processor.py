from __future__ import annotations

import os
from typing import Any, Dict


class PDFProcessor:
    """Minimal PDF validation and metadata helper for the TenderIQ prototype."""

    @staticmethod
    def is_pdf_file(filename: str) -> bool:
        if not filename:
            return False
        return filename.lower().endswith(".pdf")

    @staticmethod
    def validate_pdf_bytes(file_bytes: bytes) -> bool:
        if not file_bytes:
            return False
        return file_bytes.startswith(b"%PDF-")

    @staticmethod
    def read_pdf_metadata(file_bytes: bytes) -> Dict[str, Any]:
        metadata: Dict[str, Any] = {
            "pdf_header_detected": file_bytes.startswith(b"%PDF-"),
            "size_bytes": len(file_bytes),
        }

        try:
            header = file_bytes[:8].decode("latin-1", errors="ignore")
            metadata["header"] = header
        except Exception:
            metadata["header"] = ""

        # Placeholder for future real metadata extraction using PyMuPDF / pypdf.
        return metadata

    @staticmethod
    def build_document_summary(filename: str, file_bytes: bytes) -> Dict[str, Any]:
        return {
            "filename": filename,
            "is_valid_pdf": PDFProcessor.is_pdf_file(filename) and PDFProcessor.validate_pdf_bytes(file_bytes),
            "metadata": PDFProcessor.read_pdf_metadata(file_bytes),
            "status": "ready_for_processing",
        }
