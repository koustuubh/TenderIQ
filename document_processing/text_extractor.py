from __future__ import annotations

import io
import re
from typing import Any, Dict, List

from pypdf import PdfReader


class PDFTextExtractor:
    """Extract text page by page while preserving page numbers for evidence tracking."""

    @staticmethod
    def normalize_text(raw_text: str) -> str:
        if not raw_text:
            return ""

        cleaned = raw_text.replace("\r\n", "\n").replace("\r", "\n")
        cleaned = cleaned.replace(chr(0x00A0), " ")
        cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
        cleaned = re.sub(r"[ \t]+", " ", cleaned)
        cleaned = re.sub(r"\n ", "\n", cleaned)
        cleaned = re.sub(r" \n", "\n", cleaned)
        return cleaned.strip()

    @staticmethod
    def extract_from_bytes(filename: str, file_bytes: bytes) -> Dict[str, Any]:
        reader = PdfReader(io.BytesIO(file_bytes))
        pages: List[Dict[str, Any]] = []

        for index, page in enumerate(reader.pages, start=1):
            page_text = page.extract_text() or ""
            cleaned_text = PDFTextExtractor.normalize_text(page_text)
            pages.append(
                {
                    "page_number": index,
                    "text": cleaned_text,
                }
            )

        return {
            "document_id": "DOC001",
            "filename": filename,
            "page_count": len(pages),
            "pages": pages,
            "status": "text_extraction_complete",
        }
