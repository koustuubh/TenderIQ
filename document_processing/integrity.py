from __future__ import annotations

import hashlib
import re
from typing import Any, Dict, List


class DocumentIntegrity:
    """
    TenderIQ document integrity and audit helper.

    Responsibilities:
    - Generate a SHA-256 hash for uploaded documents.
    - Generate a normalized text fingerprint.
    - Detect duplicate documents.
    - Perform basic completeness checks.
    - Preserve traceability information.

    This module does NOT:
    - Decide bidder compliance.
    - Verify government databases.
    - Make procurement decisions.
    """

    @staticmethod
    def calculate_sha256(file_bytes: bytes) -> str:
        """
        Calculate SHA-256 hash of the original document bytes.
        """

        if not file_bytes:
            raise ValueError(
                "Cannot calculate hash for an empty file."
            )

        return hashlib.sha256(
            file_bytes
        ).hexdigest()

    @staticmethod
    def normalize_text(text: str) -> str:
        """
        Normalize text before generating a fingerprint.
        """

        if not text:
            return ""

        text = text.lower()
        text = re.sub(
            r"\s+",
            " ",
            text,
        )

        return text.strip()

    @classmethod
    def calculate_text_fingerprint(
        cls,
        text: str,
    ) -> str:
        """
        Generate a SHA-256 fingerprint from normalized text.
        """

        normalized_text = cls.normalize_text(
            text
        )

        if not normalized_text:
            return ""

        return hashlib.sha256(
            normalized_text.encode("utf-8")
        ).hexdigest()

    @staticmethod
    def compare_hashes(
        hash_one: str,
        hash_two: str,
    ) -> bool:
        """
        Check whether two documents have identical SHA-256 hashes.
        """

        if not hash_one or not hash_two:
            return False

        return hash_one.lower() == hash_two.lower()

    @classmethod
    def compare_text(
        cls,
        text_one: str,
        text_two: str,
    ) -> bool:
        """
        Check whether two documents contain identical normalized text.
        """

        fingerprint_one = cls.calculate_text_fingerprint(
            text_one
        )

        fingerprint_two = cls.calculate_text_fingerprint(
            text_two
        )

        if not fingerprint_one or not fingerprint_two:
            return False

        return fingerprint_one == fingerprint_two

    @staticmethod
    def check_completeness(
        pages: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Perform a basic page-level completeness check.

        A page is considered incomplete when it contains
        neither extracted text nor OCR text.
        """

        if not pages:
            return {
                "complete": False,
                "total_pages": 0,
                "empty_pages": [],
                "message": "No pages were provided.",
            }

        empty_pages = []

        for page in pages:
            page_number = int(
                page.get("page_number", 0)
            )

            text = str(
                page.get("text", "")
                or page.get("ocr_text", "")
            ).strip()

            if not text:
                empty_pages.append(
                    page_number
                )

        return {
            "complete": len(empty_pages) == 0,
            "total_pages": len(pages),
            "empty_pages": empty_pages,
            "message": (
                "All pages contain text."
                if not empty_pages
                else "Some pages contain no extracted text."
            ),
        }

    @staticmethod
    def check_signature_presence(
        text: str,
    ) -> Dict[str, Any]:
        """
        Detect common textual indicators of signatures.

        This is only a presence check. It does not validate
        whether a signature is genuine or legally valid.
        """

        if not text:
            return {
                "signature_present": False,
                "matched_indicator": None,
            }

        signature_patterns = [
            r"\bsignature\b",
            r"\bsigned\b",
            r"\bdigitally\s+signed\b",
            r"\bauthorized\s+signatory\b",
            r"\bauthorised\s+signatory\b",
            r"\bsignatory\b",
        ]

        for pattern in signature_patterns:
            match = re.search(
                pattern,
                text,
                flags=re.IGNORECASE,
            )

            if match:
                return {
                    "signature_present": True,
                    "matched_indicator": match.group(0),
                }

        return {
            "signature_present": False,
            "matched_indicator": None,
        }

    @classmethod
    def analyze_document(
        cls,
        filename: str,
        file_bytes: bytes,
        pages: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Generate the complete integrity record for a document.
        """

        if not filename:
            raise ValueError(
                "Filename is required."
            )

        if not file_bytes:
            raise ValueError(
                "File content is required."
            )

        document_hash = cls.calculate_sha256(
            file_bytes
        )

        document_text = "\n".join(
            str(
                page.get("text", "")
                or page.get("ocr_text", "")
            )
            for page in pages
        )

        text_fingerprint = cls.calculate_text_fingerprint(
            document_text
        )

        completeness = cls.check_completeness(
            pages
        )

        signature = cls.check_signature_presence(
            document_text
        )

        return {
            "filename": filename,
            "sha256": document_hash,
            "text_fingerprint": text_fingerprint,
            "page_count": len(pages),
            "completeness": completeness,
            "signature": signature,
            "status": "integrity_checked",
        }


def calculate_sha256(
    file_bytes: bytes,
) -> str:
    """Convenience function for SHA-256 hashing."""

    return DocumentIntegrity.calculate_sha256(
        file_bytes
    )
