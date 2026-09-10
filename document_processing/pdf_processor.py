from __future__ import annotations

import io
from typing import Any, Dict, List

from pypdf import PdfReader


class PDFProcessor:
    """
    TenderIQ PDF processing foundation.

    Responsibilities:
    - Validate PDF files.
    - Read PDF metadata.
    - Count pages.
    - Provide basic page information.

    This module does NOT:
    - Perform OCR.
    - Classify documents.
    - Extract compliance fields.
    - Make compliance decisions.
    """

    @staticmethod
    def is_pdf_file(filename: str) -> bool:
        """Check whether the filename has a PDF extension."""

        if not filename:
            return False

        return filename.lower().endswith(".pdf")

    @staticmethod
    def validate_pdf_bytes(file_bytes: bytes) -> bool:
        """Perform basic PDF signature validation."""

        if not file_bytes:
            return False

        return file_bytes.startswith(b"%PDF-")

    @staticmethod
    def read_metadata(file_bytes: bytes) -> Dict[str, Any]:
        """Read basic PDF metadata."""

        if not PDFProcessor.validate_pdf_bytes(file_bytes):
            raise ValueError("Invalid PDF file.")

        reader = PdfReader(io.BytesIO(file_bytes))
        metadata = reader.metadata or {}

        return {
            "title": metadata.get("/Title"),
            "author": metadata.get("/Author"),
            "subject": metadata.get("/Subject"),
            "creator": metadata.get("/Creator"),
            "producer": metadata.get("/Producer"),
            "page_count": len(reader.pages),
        }

    @staticmethod
    def get_page_count(file_bytes: bytes) -> int:
        """Return the number of pages in the PDF."""

        if not PDFProcessor.validate_pdf_bytes(file_bytes):
            raise ValueError("Invalid PDF file.")

        reader = PdfReader(io.BytesIO(file_bytes))

        return len(reader.pages)

    @staticmethod
    def get_page_info(file_bytes: bytes) -> List[Dict[str, Any]]:
        """
        Return basic information for every page.

        Text extraction is handled by the text extraction module.
        """

        if not PDFProcessor.validate_pdf_bytes(file_bytes):
            raise ValueError("Invalid PDF file.")

        reader = PdfReader(io.BytesIO(file_bytes))

        pages = []

        for page_number, page in enumerate(
            reader.pages,
            start=1,
        ):
            pages.append(
                {
                    "page_number": page_number,
                    "has_content": bool(page.get_contents()),
                }
            )

        return pages

    @staticmethod
    def process(
        filename: str,
        file_bytes: bytes,
    ) -> Dict[str, Any]:
        """Validate and process a PDF at the document level."""

        if not PDFProcessor.is_pdf_file(filename):
            raise ValueError("File must have a .pdf extension.")

        if not PDFProcessor.validate_pdf_bytes(file_bytes):
            raise ValueError("File is not a valid PDF.")

        metadata = PDFProcessor.read_metadata(file_bytes)
        pages = PDFProcessor.get_page_info(file_bytes)

        return {
            "filename": filename,
            "valid": True,
            "page_count": len(pages),
            "metadata": metadata,
            "pages": pages,
            "status": "pdf_ready",
        }
