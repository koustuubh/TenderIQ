from __future__ import annotations

from typing import Any, Dict, List, Optional

import pytesseract
from PIL import Image


class OCRProcessor:
    """
    TenderIQ OCR processing module.

    Responsibilities:
    - Run OCR on PDF page images supplied by the pipeline.
    - Return extracted text and confidence.
    - Preserve page-level information.

    This module does NOT:
    - Classify documents.
    - Extract compliance fields.
    - Make compliance decisions.
    """

    TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

    def __init__(self, tesseract_path: Optional[str] = None):
        self.tesseract_path = tesseract_path or self.TESSERACT_PATH
        pytesseract.pytesseract.tesseract_cmd = self.tesseract_path

    def extract_text(self, image: Image.Image) -> Dict[str, Any]:
        """
        Run OCR on a single page image.
        """

        text = pytesseract.image_to_string(image)

        cleaned_text = text.strip()

        confidence = self._calculate_confidence(image)

        return {
            "text": cleaned_text,
            "confidence": confidence,
            "character_count": len(cleaned_text),
            "status": "ocr_completed",
        }

    def _calculate_confidence(self, image: Image.Image) -> float:
        """
        Calculate average OCR confidence for the page.
        """

        data = pytesseract.image_to_data(
            image,
            output_type=pytesseract.Output.DICT,
        )

        confidences: List[float] = []

        for value in data["conf"]:
            try:
                confidence = float(value)

                if confidence >= 0:
                    confidences.append(confidence)

            except (ValueError, TypeError):
                continue

        if not confidences:
            return 0.0

        return round(sum(confidences) / len(confidences) / 100, 2)

    def process_page(
        self,
        image: Image.Image,
        page_number: int,
    ) -> Dict[str, Any]:
        """
        Process one PDF page through OCR.
        """

        result = self.extract_text(image)

        return {
            "page_number": page_number,
            **result,
        }

    def process_pages(
        self,
        pages: List[Image.Image],
    ) -> List[Dict[str, Any]]:
        """
        Process multiple PDF pages through OCR.
        """

        results = []

        for page_number, image in enumerate(pages, start=1):
            results.append(
                self.process_page(
                    image=image,
                    page_number=page_number,
                )
            )

        return results


def ocr_image(image: Image.Image) -> Dict[str, Any]:
    """
    Convenience function for OCR processing.
    """

    processor = OCRProcessor()

    return processor.extract_text(image)
