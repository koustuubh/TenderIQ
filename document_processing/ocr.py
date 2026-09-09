from __future__ import annotations

import re
from typing import Any, Dict, List, Optional


class OCRAdapter:
    """Base OCR adapter interface. Replace this later with Tesseract/Azure OCR."""

    def extract_text(self, image_bytes: bytes, page_number: int) -> Dict[str, Any]:
        raise NotImplementedError("OCR adapter must implement extract_text().")


class SimpleOCRAdapter(OCRAdapter):
    """Fallback OCR placeholder for scanned PDFs. It is intentionally simple but modular."""

    def extract_text(self, image_bytes: bytes, page_number: int) -> Dict[str, Any]:
        # In a real project, this would call Tesseract or another OCR provider.
        # For the prototype, we return a conservative placeholder result.
        return {
            "page_number": page_number,
            "text": "OCR placeholder text: scanned content not yet processed by a provider.",
            "confidence": 0.60,
            "status": "ocr_placeholder",
        }


class OCRProcessor:
    """Determines whether OCR is needed and stores page-level OCR results."""

    def __init__(self, adapter: Optional[OCRAdapter] = None):
        self.adapter = adapter or SimpleOCRAdapter()

    @staticmethod
    def should_use_ocr(page_text: str) -> bool:
        if not page_text:
            return True

        cleaned = re.sub(r"\s+", " ", page_text).strip()
        if len(cleaned) < 30:
            return True

        letters = sum(ch.isalpha() for ch in cleaned)
        if letters == 0:
            return True

        return False

    def run_ocr_for_page(self, page_number: int, page_text: str, image_bytes: Optional[bytes] = None) -> Dict[str, Any]:
        if image_bytes is None:
            image_bytes = b""

        if not self.should_use_ocr(page_text):
            return {
                "page_number": page_number,
                "text": page_text,
                "ocr_used": False,
                "confidence": 1.0,
                "status": "direct_text_extraction",
            }

        result = self.adapter.extract_text(image_bytes, page_number)
        result["ocr_used"] = True
        result["page_number"] = page_number
        return result

    def run_batch_ocr(self, pages: List[Dict[str, Any]], image_pages: Optional[Dict[int, bytes]] = None) -> List[Dict[str, Any]]:
        image_pages = image_pages or {}
        results: List[Dict[str, Any]] = []

        for page in pages:
            page_number = int(page.get("page_number", 1))
            page_text = str(page.get("text", ""))
            image_bytes = image_pages.get(page_number, b"")
            results.append(self.run_ocr_for_page(page_number, page_text, image_bytes))

        return results
