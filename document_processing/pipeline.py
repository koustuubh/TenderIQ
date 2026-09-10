from __future__ import annotations

from typing import Any, Dict, List

import pypdfium2 as pdfium

from .classifier import DocumentClassifier
from .evidence import EvidenceBuilder
from .extractor import FieldExtractor
from .integrity import DocumentIntegrity
from .ocr import OCRProcessor
from .pdf_processor import PDFProcessor
from .text_extractor import TextExtractor


class DocumentProcessingPipeline:
    """
    TenderIQ end-to-end document processing pipeline.

    Flow:

        PDF
         ↓
        PDF Processor
         ↓
        Text Extraction
         ↓
        OCR fallback for scanned pages
         ↓
        Classification
         ↓
        Field Extraction
         ↓
        Evidence
         ↓
        Integrity / Audit
         ↓
        Structured Result

    This pipeline prepares bidder documents for the
    TenderIQ AI Compliance Engine.

    It does NOT:
    - Make compliance decisions.
    - Calculate bidder risk.
    - Qualify or disqualify bidders.
    """

    def __init__(self) -> None:
        self.pdf_processor = PDFProcessor()
        self.text_extractor = TextExtractor()
        self.ocr_processor = OCRProcessor()
        self.classifier = DocumentClassifier()
        self.field_extractor = FieldExtractor()
        self.evidence_builder = EvidenceBuilder()
        self.integrity = DocumentIntegrity()

    @staticmethod
    def _render_page(
        pdf_document: Any,
        page_number: int,
    ) -> Any:
        """
        Render one PDF page into a PIL image.

        page_number is 1-based.
        """

        page = pdf_document[
            page_number - 1
        ]

        bitmap = page.render(
            scale=2.0
        )

        image = bitmap.to_pil()

        page.close()

        return image

    def _apply_ocr(
        self,
        file_bytes: bytes,
        pages: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """
        Run OCR only on pages that do not contain
        extractable PDF text.
        """

        ocr_pages = [
            page
            for page in pages
            if page.get("needs_ocr", False)
        ]

        if not ocr_pages:
            return pages

        pdf_document = pdfium.PdfDocument(
            file_bytes
        )

        try:
            for page in ocr_pages:

                page_number = int(
                    page["page_number"]
                )

                image = self._render_page(
                    pdf_document,
                    page_number,
                )

                ocr_result = (
                    self.ocr_processor.process_page(
                        image=image,
                        page_number=page_number,
                    )
                )

                page["text"] = ocr_result["text"]
                page["ocr_text"] = ocr_result["text"]
                page["ocr_confidence"] = ocr_result[
                    "confidence"
                ]
                page["character_count"] = ocr_result[
                    "character_count"
                ]
                page["needs_ocr"] = False
                page["ocr_status"] = ocr_result[
                    "status"
                ]

        finally:
            pdf_document.close()

        return pages

    def process(
        self,
        filename: str,
        file_bytes: bytes,
    ) -> Dict[str, Any]:
        """
        Process one bidder PDF from start to finish.
        """

        # ---------------------------------------------------------
        # 1. Validate and inspect PDF
        # ---------------------------------------------------------

        pdf_result = self.pdf_processor.process(
            filename,
            file_bytes,
        )

        # ---------------------------------------------------------
        # 2. Extract embedded PDF text
        # ---------------------------------------------------------

        text_result = self.text_extractor.process(
            filename,
            file_bytes,
        )

        pages = text_result["pages"]

        # ---------------------------------------------------------
        # 3. OCR scanned pages
        # ---------------------------------------------------------

        pages = self._apply_ocr(
            file_bytes,
            pages,
        )

        # ---------------------------------------------------------
        # 4. Build complete document text
        # ---------------------------------------------------------

        document_text = "\n\n".join(
            page.get("text", "")
            for page in pages
            if page.get("text", "")
        )

        ocr_pages = [
            page["page_number"]
            for page in pages
            if page.get("ocr_status") == "ocr_completed"
        ]

        # ---------------------------------------------------------
        # 5. Classify document
        # ---------------------------------------------------------

        classification = self.classifier.classify(
            document_text
        )

        # ---------------------------------------------------------
        # 6. Extract bidder fields
        # ---------------------------------------------------------

        extraction = self.field_extractor.extract_all(
            document_text
        )

        page_extractions = (
            self.field_extractor.extract_from_pages(
                pages
            )
        )

        # ---------------------------------------------------------
        # 7. Build traceable evidence
        # ---------------------------------------------------------

        evidence_items = (
            self.evidence_builder.build_from_pages(
                document_name=filename,
                pages=pages,
                extraction_results=page_extractions,
            )
        )

        # ---------------------------------------------------------
        # 8. Integrity / audit information
        # ---------------------------------------------------------

        integrity_result = (
            self.integrity.analyze_document(
                filename=filename,
                file_bytes=file_bytes,
                pages=pages,
            )
        )

        # ---------------------------------------------------------
        # 9. Final structured result
        # ---------------------------------------------------------

        return {
            "filename": filename,

            "pdf": pdf_result,

            "text": {
                "page_count": len(pages),
                "pages": pages,
                "document_text": document_text,
                "ocr_pages": ocr_pages,
            },

            "classification": classification.to_dict(),

            "extraction": extraction,

            "page_extractions": page_extractions,

            "evidence": (
                self.evidence_builder.to_dict_list(
                    evidence_items
                )
            ),

            "integrity": integrity_result,

            "status": "document_processed",
        }


def process_document(
    filename: str,
    file_bytes: bytes,
) -> Dict[str, Any]:
    """
    Convenience function for processing a bidder document.
    """

    pipeline = DocumentProcessingPipeline()

    return pipeline.process(
        filename=filename,
        file_bytes=file_bytes,
    )