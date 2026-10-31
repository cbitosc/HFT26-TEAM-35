import io
from typing import Dict, Any

try:
    import docx
    from docx.shared import Inches, Pt, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False


class ExportService:
    """
    Generates ATS-conscious single-column resume documents in DOCX and PDF/HTML formats.
    """

    def generate_docx(self, resume_data: Dict[str, Any]) -> bytes:
        """Create single-column Word document matching ATS best practices."""
        doc = docx.Document() if HAS_DOCX else None
        if not doc:
            # Fallback plain-text formatted output
            text_rep = self.generate_plain_text(resume_data)
            return text_rep.encode("utf-8")

        # Set standard 0.75-inch margins
        for section in doc.sections:
            section.top_margin = Inches(0.75)
            section.bottom_margin = Inches(0.75)
            section.left_margin = Inches(0.75)
            section.right_margin = Inches(0.75)

        p_info = resume_data.get("personalInfo", {})
        
        # Header / Candidate Name
        h1 = doc.add_paragraph()
        h1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run_name = h1.add_run(p_info.get("fullName", "Candidate Name"))
        run_name.font.size = Pt(20)
        run_name.font.bold = True
        run_name.font.name = "Calibri"

        # Subtitle Contact Bar
        contact_line = []
        if p_info.get("location"): contact_line.append(p_info.get("location"))
        if p_info.get("phone"): contact_line.append(p_info.get("phone"))
        if p_info.get("email"): contact_line.append(p_info.get("email"))
        if p_info.get("linkedin"): contact_line.append(p_info.get("linkedin"))
        if p_info.get("github"): contact_line.append(p_info.get("github"))

        p_contact = doc.add_paragraph(" | ".join(contact_line))
        p_contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_contact.paragraph_format.space_after = Pt(12)

        # Summary Section
        summary = resume_data.get("summary")
        if summary:
            self._add_heading(doc, "PROFESSIONAL SUMMARY")
            p_sum = doc.add_paragraph(summary)
            p_sum.paragraph_format.space_after = Pt(10)

        # Technical Skills
        skills = resume_data.get("skills", {})
        tech_skills = skills.get("technical", []) if isinstance(skills, dict) else skills
        tools = skills.get("softAndTools", []) if isinstance(skills, dict) else []
        if tech_skills or tools:
            self._add_heading(doc, "TECHNICAL SKILLS")
            if tech_skills:
                p_sk = doc.add_paragraph()
                r1 = p_sk.add_run("Languages & Frameworks: ")
                r1.bold = True
                p_sk.add_run(", ".join(tech_skills))
            if tools:
                p_to = doc.add_paragraph()
                r2 = p_to.add_run("Tools & Architectures: ")
                r2.bold = True
                p_to.add_run(", ".join(tools))
            doc.add_paragraph().paragraph_format.space_after = Pt(6)

        # Experience Section
        experience = resume_data.get("experience", [])
        if experience:
            self._add_heading(doc, "PROFESSIONAL EXPERIENCE")
            for exp in experience:
                p_role = doc.add_paragraph()
                r_title = p_role.add_run(exp.get("jobTitle", "Role"))
                r_title.bold = True
                p_role.add_run(f" | {exp.get('company', 'Company')} ({exp.get('startDate', '')} - {exp.get('endDate', 'Present')})")
                
                for bullet in exp.get("bullets", []):
                    if bullet.strip():
                        bp = doc.add_paragraph(bullet.strip(), style="List Bullet")
                        bp.paragraph_format.space_after = Pt(2)

        # Projects Section
        projects = resume_data.get("projects", [])
        if projects:
            self._add_heading(doc, "TECHNICAL PROJECTS")
            for proj in projects:
                p_proj = doc.add_paragraph()
                r_p = p_proj.add_run(proj.get("title", "Project"))
                r_p.bold = True
                if proj.get("tech"):
                    p_proj.add_run(f" | Tech: {proj.get('tech')}")
                if proj.get("description"):
                    doc.add_paragraph(proj.get("description"))
                for b in proj.get("bullets", []):
                    if b.strip():
                        bp = doc.add_paragraph(b.strip(), style="List Bullet")
                        bp.paragraph_format.space_after = Pt(2)

        # Education Section
        education = resume_data.get("education", [])
        if education:
            self._add_heading(doc, "EDUCATION")
            for edu in education:
                p_edu = doc.add_paragraph()
                r_deg = p_edu.add_run(edu.get("degree", "Degree"))
                r_deg.bold = True
                p_edu.add_run(f" — {edu.get('institution', 'Institution')} ({edu.get('graduationYear', '')})")
                if edu.get("details"):
                    doc.add_paragraph(edu.get("details"))

        out_buffer = io.BytesIO()
        doc.save(out_buffer)
        return out_buffer.getvalue()

    def _add_heading(self, doc, title: str):
        h = doc.add_paragraph()
        run = h.add_run(title)
        run.bold = True
        run.font.size = Pt(11)
        run.font.name = "Calibri"
        run.font.color.rgb = RGBColor(27, 67, 50)  # Forest Green #1B4332
        h.paragraph_format.space_before = Pt(8)
        h.paragraph_format.space_after = Pt(4)

    def generate_html(self, resume_data: Dict[str, Any]) -> str:
        """Generate high-fidelity HTML for browser printing / PDF generation."""
        p_info = resume_data.get("personalInfo", {})
        summary = resume_data.get("summary", "")
        skills = resume_data.get("skills", {})
        experience = resume_data.get("experience", [])
        projects = resume_data.get("projects", [])
        education = resume_data.get("education", [])

        contact_parts = [
            p_info.get("location"),
            p_info.get("phone"),
            p_info.get("email"),
            p_info.get("linkedin"),
            p_info.get("github")
        ]
        contact_str = " &bull; ".join([p for p in contact_parts if p])

        tech_skills = skills.get("technical", []) if isinstance(skills, dict) else skills
        tools = skills.get("softAndTools", []) if isinstance(skills, dict) else []

        exp_html = ""
        for exp in experience:
            bullets_html = "".join([f"<li>{b}</li>" for b in exp.get("bullets", [])])
            exp_html += f"""
            <div class="item">
                <div class="item-header">
                    <strong>{exp.get('jobTitle')}</strong> &mdash; <span>{exp.get('company')}</span>
                    <span class="dates">{exp.get('startDate')} - {exp.get('endDate')}</span>
                </div>
                <ul>{bullets_html}</ul>
            </div>
            """

        proj_html = ""
        for p in projects:
            p_bullets = "".join([f"<li>{b}</li>" for b in p.get("bullets", [])])
            proj_html += f"""
            <div class="item">
                <div class="item-header">
                    <strong>{p.get('title')}</strong> <span class="tech-tag">[{p.get('tech')}]</span>
                </div>
                <p>{p.get('description', '')}</p>
                <ul>{p_bullets}</ul>
            </div>
            """

        edu_html = ""
        for edu in education:
            edu_html += f"""
            <div class="item">
                <div class="item-header">
                    <strong>{edu.get('degree')}</strong> &mdash; <span>{edu.get('institution')}</span>
                    <span class="dates">{edu.get('graduationYear')}</span>
                </div>
                {f'<p class="details">{edu.get("details")}</p>' if edu.get("details") else ''}
            </div>
            """

        return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>{p_info.get('fullName', 'Resume')}</title>
<style>
  @page {{ margin: 0.75in; size: letter; }}
  body {{ font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.4; font-size: 10.5pt; margin: 0; padding: 20px; }}
  h1 {{ text-align: center; font-size: 18pt; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px; }}
  .contact {{ text-align: center; font-size: 9.5pt; color: #444; margin-bottom: 16px; border-bottom: 1.5px solid #1B4332; padding-bottom: 8px; }}
  h2 {{ font-size: 11pt; text-transform: uppercase; color: #1B4332; border-bottom: 1px solid #ccc; margin: 12px 0 6px 0; letter-spacing: 0.5px; }}
  .item {{ margin-bottom: 8px; }}
  .item-header {{ display: flex; justify-content: space-between; font-size: 10.5pt; margin-bottom: 2px; }}
  .dates {{ font-style: italic; color: #555; }}
  .tech-tag {{ font-size: 9pt; color: #555; }}
  ul {{ margin: 2px 0 6px 18px; padding: 0; }}
  li {{ margin-bottom: 2px; }}
  p {{ margin: 2px 0; }}
</style>
</head>
<body>
  <h1>{p_info.get('fullName', 'Candidate Name')}</h1>
  <div class="contact">{contact_str}</div>

  {f'<h2>Professional Summary</h2><p>{summary}</p>' if summary else ''}

  <h2>Technical Skills</h2>
  <p><strong>Languages & Frameworks:</strong> {", ".join(tech_skills)}</p>
  {f'<p><strong>Tools & Practices:</strong> {", ".join(tools)}</p>' if tools else ''}

  <h2>Professional Experience</h2>
  {exp_html}

  <h2>Technical Projects</h2>
  {proj_html}

  <h2>Education</h2>
  {edu_html}
</body>
</html>"""

    def generate_plain_text(self, resume_data: Dict[str, Any]) -> str:
        p_info = resume_data.get("personalInfo", {})
        return f"{p_info.get('fullName')}\n{p_info.get('email')} | {p_info.get('phone')}\n\nSUMMARY:\n{resume_data.get('summary')}"


export_service = ExportService()
