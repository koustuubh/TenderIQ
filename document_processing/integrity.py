from __future__ import annotations

import hashlib
import re
from typing import Any, Dict, List


class IntegrityChecker:
    """Provide deterministic duplicate and document completeness indicators."""

    @staticmethod
    def file_hash(file_bytes: bytes) -> str:
        return hashlib.sha256(file_bytes).hexdigest()

    @staticmethod
    def text_fingerprint(text: str) -> str:
        normalized = re.sub(r"\W+", " ", text or "", flags=re.UNICODE).lower().strip()
        return hashlib.sha256(normalized.encode("utf-8")).hexdigest()

    @classmethod
    def compare_documents(cls, first: bytes, second: bytes) -> Dict[str, Any]:
        first_hash = cls.file_hash(first)
        second_hash = cls.file_hash(second)
        return {
            "identical_file": first_hash == second_hash,
            "first_hash": first_hash,
            "second_hash": second_hash,
            "status": "duplicate" if first_hash == second_hash else "different",
        }

    @staticmethod
    def check_completeness(
        pages: List[Dict[str, Any]],
        required_page_count: int | None = None,
        require_signature: bool = False,
    ) -> Dict[str, Any]:
        page_numbers = [page.get("page_number") for page in pages]
        missing_pages = []
        if required_page_count:
            missing_pages = [page for page in range(1, required_page_count + 1) if page not in page_numbers]

        full_text = "\n".join(str(page.get("text", "")) for page in pages)
        signature_found = bool(re.search(r"signature|signed by|authorized signatory", full_text, re.IGNORECASE))
        findings = []
        if missing_pages:
            findings.append("missing_pages")
        if require_signature and not signature_found:
            findings.append("missing_signature")

        return {
            "missing_pages": missing_pages,
            "signature_required": require_signature,
            "signature_found": signature_found,
            "findings": findings,
            "status": "review" if findings else "clear",
        }
