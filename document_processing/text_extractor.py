from __future__ import annotations

import io
from typing import Any, Dict, List

from pypdf import PdfReader


class TextExtractor:
    """
    TenderIQ text extraction module.

    Responsibilities:
    - Extract text from every PDF page.
    - Preserve page numbers.
    - Detect pages that may require OCR.
    - Provide document-level extraction output.
    """

    @staticmethod
    def extract_pages(
        file_bytes: bytes,
    ) -> List[Dict[str, Any]]:
        """Extract text page-by-page."""

        if not file_bytes:
            raise ValueError("PDF content is required.")

        reader = PdfReader(
            io.BytesIO(file_bytes)
        )

        pages = []

        for page_number, page in enumerate(
            reader.pages,
            start=1,
        ):
            text = page.extract_text() or ""
            cleaned_text = text.strip()

            pages.append(
                {
                    "page_number": page_number,
                    "text": cleaned_text,
                    "character_count": len(cleaned_text),
                    "needs_ocr": len(cleaned_text) == 0,
                }
            )

        return pages

    @staticmethod
    def extract_document_text(
        file_bytes: bytes,
    ) -> str:
        """Return the complete extracted document text."""

        pages = TextExtractor.extract_pages(
            file_bytes
        )

        return "\n\n".join(
            page["text"]
            for page in pages
            if page["text"]
        )

    @staticmethod
    def process(
        filename: str,
        file_bytes: bytes,
    ) -> Dict[str, Any]:
        """Process a complete PDF for text extraction."""

        if not filename:
            raise ValueError("Filename is required.")

        pages = TextExtractor.extract_pages(
            file_bytes
        )

        document_text = "\n\n".join(
            page["text"]
            for page in pages
            if page["text"]
        )

        ocr_required_pages = [
            page["page_number"]
            for page in pages
            if page["needs_ocr"]
        ]

        return {
            "filename": filename,
            "page_count": len(pages),
            "pages": pages,
            "document_text": document_text,
            "ocr_required_pages": ocr_required_pages,
            "status": "text_extracted",
        }