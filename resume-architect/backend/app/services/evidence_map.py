import re
from typing import Dict, Any, List


class EvidenceMapService:
    """
    EvidenceMap generator that links job requirements directly
    to verifiable sections and bullet points within the candidate's resume.
    """

    def generate_evidence_map(
        self,
        resume_data: Dict[str, Any],
        raw_text: str,
        matched_skills: List[str],
        unmatched_skills: List[str],
        semantic_evidence: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        evidence_items = []
        raw_lower = (raw_text + " " + str(resume_data)).lower()

        # Check semantic evidence provided by Gemini if available
        semantic_map = {}
        if semantic_evidence and "evidence_map" in semantic_evidence:
            for item in semantic_evidence["evidence_map"]:
                semantic_map[item.get("requirement", "").lower()] = item

        # Matched Requirements
        for idx, skill in enumerate(matched_skills):
            skill_clean = skill.title()
            sem = semantic_map.get(skill.lower())
            
            # Find location in resume
            location = "Skills Section"
            evidence_snippet = f"Listed in candidate technical competencies: '{skill_clean}'."

            # Check if mentioned in experience or projects
            for exp in resume_data.get("experience", []):
                for bullet in exp.get("bullets", []):
                    if skill.lower() in bullet.lower():
                        location = f"Experience: {exp.get('company', 'Professional Role')}"
                        evidence_snippet = f"Demonstrated in bullet: '{bullet.strip()[:120]}...'"
                        break

            for proj in resume_data.get("projects", []):
                if skill.lower() in proj.get("tech", "").lower() or skill.lower() in proj.get("description", "").lower():
                    location = f"Projects: {proj.get('title', 'Technical Deliverable')}"
                    evidence_snippet = f"Applied in project tech stack: {proj.get('tech')}"

            if sem:
                location = sem.get("location", location)
                evidence_snippet = sem.get("resumeEvidence", evidence_snippet)

            evidence_items.append({
                "id": f"ev_matched_{idx + 1}",
                "requirement": skill_clean,
                "category": "Technical Qualification",
                "status": "MATCHED",
                "resumeEvidence": evidence_snippet,
                "location": location,
                "explanation": f"Verifiable evidence found in candidate's {location}."
            })

        # Partially Matched or Domain Requirements
        domain_patterns = [
            ("REST APIs", "API Architecture", "Design and consumption of backend endpoints"),
            ("CI/CD", "Automated Pipelines", "Deployment pipelines and test automation"),
            ("System Architecture", "Scalable Systems", "Distributed system patterns and data flow")
        ]
        for term, label, desc in domain_patterns:
            if term.lower() in raw_lower:
                evidence_items.append({
                    "id": f"ev_domain_{len(evidence_items) + 1}",
                    "requirement": label,
                    "category": "Architecture & Methodology",
                    "status": "MATCHED",
                    "resumeEvidence": f"Referenced in technical projects/workflow description.",
                    "location": "Technical Architecture",
                    "explanation": f"Candidate demonstrates familiarity with {desc}."
                })

        # Unmatched Requirements (NOT FOUND)
        # Note: Do not interpret NOT FOUND as proof that the candidate lacks the skill.
        for idx, skill in enumerate(unmatched_skills[:4]):
            skill_clean = skill.title()
            evidence_items.append({
                "id": f"ev_unmatched_{idx + 1}",
                "requirement": skill_clean,
                "category": "Target Role Specification",
                "status": "NOT FOUND",
                "resumeEvidence": "No direct mention in current resume draft.",
                "location": "Not Documented",
                "explanation": (
                    f"'{skill_clean}' was not explicitly identified in the uploaded document. "
                    "Note: This indicates absence in the written resume text, not necessarily candidate inability."
                )
            })

        return evidence_items


evidence_map_service = EvidenceMapService()
