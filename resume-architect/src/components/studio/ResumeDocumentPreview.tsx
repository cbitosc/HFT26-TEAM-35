import React, { useState } from 'react';
import { ResumeStudioData } from '../../types';
import { Button } from '../common/Button';
import {
  Download,
  Save,
  Check,
  FileText,
  Printer,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ResumeDocumentPreviewProps {
  data: ResumeStudioData;
  onSaveToRepository: () => Promise<void>;
  isSaving?: boolean;
}

export const ResumeDocumentPreview: React.FC<ResumeDocumentPreviewProps> = ({
  data,
  onSaveToRepository,
  isSaving = false,
}) => {
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleExportSimulated = (format: 'PDF' | 'DOCX') => {
    setDownloadToast(`Exporting ATS-compliant ${format} document...`);
    setTimeout(() => {
      setDownloadToast(`Saved ${format} for ${data.personalInfo.fullName || 'Candidate'}.`);
      setTimeout(() => setDownloadToast(null), 3000);
    }, 700);
  };

  return (
    <div className="space-y-4">
      {/* Toast */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B4332] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-elevated flex items-center gap-2">
          <Check className="w-4 h-4 text-[#A3C4B0]" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Control bar */}
      <div className="bg-white rounded-2xl border border-[#E5E1D7] p-3.5 shadow-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#1C201D]">Live ATS Document Preview</span>
          <span className="text-[10px] font-mono font-semibold text-[#1B4332] bg-[#EBF2EC] px-2 py-0.5 rounded">
            Single-Column ATS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            title="Print or Save as PDF via Browser"
          >
            Print
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExportSimulated('PDF')}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            PDF
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onSaveToRepository}
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save to My Resumes
          </Button>
        </div>
      </div>

      {/* The Actual Resume Sheet (Standard 8.5" x 11" aspect ratio styling) */}
      <div
        id="resume-document-sheet"
        className="bg-white rounded-xl border border-[#D5D0C4] shadow-card p-8 sm:p-12 text-[#1C201D] font-sans text-xs leading-relaxed max-w-[850px] mx-auto min-h-[900px] transition-all"
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
      >
        {/* HEADER SECTION */}
        <div className="text-center pb-4 border-b border-[#1C201D] space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight uppercase text-[#1C201D]">
            {data.personalInfo.fullName || 'Candidate Name'}
          </h1>

          {data.careerObjective.targetJobRole && (
            <p className="text-xs font-semibold text-[#1B4332] tracking-wide uppercase">
              {data.careerObjective.targetJobRole}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-[#57605A] pt-0.5">
            {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
            {data.personalInfo.phone && (
              <>
                <span aria-hidden="true">·</span>
                <span>{data.personalInfo.phone}</span>
              </>
            )}
            {data.personalInfo.email && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#1C201D]">{data.personalInfo.email}</span>
              </>
            )}
            {data.personalInfo.linkedinUrl && (
              <>
                <span aria-hidden="true">·</span>
                <span>{data.personalInfo.linkedinUrl}</span>
              </>
            )}
            {data.personalInfo.githubUrl && (
              <>
                <span aria-hidden="true">·</span>
                <span>{data.personalInfo.githubUrl}</span>
              </>
            )}
            {data.personalInfo.portfolioUrl && (
              <>
                <span aria-hidden="true">·</span>
                <span>{data.personalInfo.portfolioUrl}</span>
              </>
            )}
          </div>
        </div>

        {/* SECTION: PROFESSIONAL SUMMARY */}
        {data.careerObjective.professionalSummary && (
          <div className="pt-4 space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1C201D] border-b border-[#E5E1D7] pb-1">
              Professional Summary
            </h2>
            <p className="text-xs text-[#394B40] leading-relaxed text-justify">
              {data.careerObjective.professionalSummary}
            </p>
          </div>
        )}

        {/* SECTION: TECHNICAL SKILLS */}
        {Object.values(data.skills).some((arr) => arr.length > 0) && (
          <div className="pt-4 space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1C201D] border-b border-[#E5E1D7] pb-1">
              Technical Skills
            </h2>
            <div className="space-y-1 text-xs">
              {data.skills.programmingLanguages.length > 0 && (
                <div>
                  <span className="font-semibold text-[#1C201D]">Programming Languages: </span>
                  <span className="text-[#57605A]">
                    {data.skills.programmingLanguages.join(', ')}
                  </span>
                </div>
              )}
              {data.skills.frameworks.length > 0 && (
                <div>
                  <span className="font-semibold text-[#1C201D]">Frameworks & Libraries: </span>
                  <span className="text-[#57605A]">{data.skills.frameworks.join(', ')}</span>
                </div>
              )}
              {data.skills.databases.length > 0 && (
                <div>
                  <span className="font-semibold text-[#1C201D]">Databases & Streaming: </span>
                  <span className="text-[#57605A]">{data.skills.databases.join(', ')}</span>
                </div>
              )}
              {data.skills.developerTools.length > 0 && (
                <div>
                  <span className="font-semibold text-[#1C201D]">Developer Tools & Cloud: </span>
                  <span className="text-[#57605A]">{data.skills.developerTools.join(', ')}</span>
                </div>
              )}
              {data.skills.coreSubjects.length > 0 && (
                <div>
                  <span className="font-semibold text-[#1C201D]">Core Computer Science: </span>
                  <span className="text-[#57605A]">{data.skills.coreSubjects.join(', ')}</span>
                </div>
              )}
              {data.skills.otherSkills.length > 0 && (
                <div>
                  <span className="font-semibold text-[#1C201D]">Core Competencies: </span>
                  <span className="text-[#57605A]">{data.skills.otherSkills.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION: WORK EXPERIENCE */}
        {data.experience.some((e) => e.organisation || e.jobTitle) && (
          <div className="pt-4 space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1C201D] border-b border-[#E5E1D7] pb-1">
              Work Experience
            </h2>
            <div className="space-y-3">
              {data.experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#1C201D]">{exp.jobTitle || 'Role Title'}</span>
                      {exp.organisation && (
                        <span className="text-[#57605A]"> — {exp.organisation}</span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-[#848E88] shrink-0">
                      {exp.startDate || 'YYYY'} – {exp.isCurrent ? 'Present' : exp.endDate || 'YYYY'}
                    </span>
                  </div>

                  {/* Bullet points */}
                  {exp.responsibilities && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-[#394B40]">
                      {exp.responsibilities
                        .split('\n')
                        .map((b) => b.trim())
                        .filter(Boolean)
                        .map((bullet, i) => (
                          <li key={i} className="leading-relaxed">
                            {bullet.replace(/^[•\-\*\s]+/, '')}
                          </li>
                        ))}
                    </ul>
                  )}

                  {exp.keyAchievements && (
                    <p className="text-[11px] text-[#1B4332] font-medium pl-4 italic">
                      Key Impact: {exp.keyAchievements}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: TECHNICAL PROJECTS */}
        {data.projects.some((p) => p.projectName) && (
          <div className="pt-4 space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1C201D] border-b border-[#E5E1D7] pb-1">
              Technical Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#1C201D]">{proj.projectName}</span>
                      {proj.technologiesUsed && (
                        <span className="text-[#57605A] text-[11px]">
                          {' '}
                          | <em>{proj.technologiesUsed}</em>
                        </span>
                      )}
                    </div>
                    {proj.projectLink && (
                      <span className="text-[11px] text-[#1B4332] font-mono truncate max-w-[200px]">
                        {proj.projectLink}
                      </span>
                    )}
                  </div>

                  {proj.projectDescription && (
                    <p className="text-xs text-[#57605A] leading-relaxed">
                      {proj.projectDescription}
                    </p>
                  )}

                  {proj.keyContributions && (
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-[#394B40]">
                      {proj.keyContributions
                        .split('\n')
                        .map((c) => c.trim())
                        .filter(Boolean)
                        .map((contribution, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {contribution.replace(/^[•\-\*\s]+/, '')}
                          </li>
                        ))}
                    </ul>
                  )}

                  {proj.projectOutcome && (
                    <p className="text-[11px] text-[#1B4332] font-medium pl-4 italic">
                      Outcome: {proj.projectOutcome}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: EDUCATION */}
        {data.education.some((e) => e.institutionName || e.degree) && (
          <div className="pt-4 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1C201D] border-b border-[#E5E1D7] pb-1">
              Education
            </h2>
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex items-baseline justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#1C201D]">
                      {edu.degree || 'Degree'}
                      {edu.branch ? ` in ${edu.branch}` : ''}
                    </span>
                    <p className="text-xs text-[#57605A]">{edu.institutionName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-[#848E88] block">
                      {edu.startYear ? `${edu.startYear} – ` : ''}
                      {edu.graduationYear || 'Year'}
                    </span>
                    {edu.cgpaOrPercentage && (
                      <span className="text-[11px] font-mono text-[#1B4332] font-medium">
                        GPA: {edu.cgpaOrPercentage}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
