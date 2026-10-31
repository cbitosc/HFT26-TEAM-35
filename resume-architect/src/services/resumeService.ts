import { ResumeItem } from '../types';
import { apiClient } from './api';

const STORAGE_KEY_RESUMES = 'resume_architect_dev_resumes';

const INITIAL_BENCHMARK_RESUMES: ResumeItem[] = [
  {
    id: 'res_staff_systems_01',
    title: 'Staff Distributed Systems Engineer — Core',
    targetJobTitle: 'Staff Distributed Systems Engineer',
    targetCompany: 'High-Concurrency Cloud Platform',
    updatedAt: '2026-10-28T14:32:00Z',
    createdAt: '2026-10-15T09:12:00Z',
    version: 'v3.2',
    format: 'ATS Minimalist',
    score: 82,
    scoreGrade: 'Strong',
    pageCount: 1,
    wordCount: 480,
    tags: ['Go', 'Kubernetes', 'High-Concurrency', 'Kafka'],
    summarySnippet:
      'Staff Software Architect with 7+ years orchestrating zero-downtime event-driven microservices across 8.4M peak daily transactions.',
  },
  {
    id: 'res_vp_product_02',
    title: 'VP of Product — Enterprise B2B Focus',
    targetJobTitle: 'VP of Product Management',
    targetCompany: 'Enterprise SaaS Solutions',
    updatedAt: '2026-10-24T11:15:00Z',
    createdAt: '2026-10-10T16:45:00Z',
    version: 'v2.0',
    format: 'Executive Modern',
    score: 91,
    scoreGrade: 'Exceptional',
    pageCount: 2,
    wordCount: 610,
    tags: ['B2B SaaS', 'SOC2 Compliance', 'ARR Scaling', 'PLG'],
    summarySnippet:
      'Product Executive with proven track record scaling B2B enterprise tier from pilot to $14.2M new ARR with 2.8% net churn.',
  },
  {
    id: 'res_eng_lead_fintech_03',
    title: 'Senior Infrastructure Architect — Fintech',
    targetJobTitle: 'Lead Cloud Infrastructure Architect',
    targetCompany: 'Global Payments Co',
    updatedAt: '2026-10-18T08:20:00Z',
    createdAt: '2026-10-05T12:00:00Z',
    version: 'v1.4',
    format: 'Technical Specialist',
    score: 74,
    scoreGrade: 'Competitive',
    pageCount: 1,
    wordCount: 520,
    tags: ['AWS', 'Terraform', 'Fintech SLA', 'eBPF'],
    summarySnippet:
      'Cloud Infrastructure Specialist driving multi-region AWS architectures maintaining 99.999% SLA across financial settlement pipelines.',
  },
];

export const resumeService = {
  /**
   * Retrieves all resumes for the candidate.
   * Ready for FastAPI `/api/v1/resumes`.
   */
  async getResumes(): Promise<ResumeItem[]> {
    try {
      return await apiClient<ResumeItem[]>('/resumes');
    } catch {
      // Local dev storage fallback
      const stored = localStorage.getItem(STORAGE_KEY_RESUMES);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(INITIAL_BENCHMARK_RESUMES));
        return INITIAL_BENCHMARK_RESUMES;
      }
      try {
        return JSON.parse(stored);
      } catch {
        return INITIAL_BENCHMARK_RESUMES;
      }
    }
  },

  /**
   * Retrieves single resume by ID.
   */
  async getResumeById(id: string): Promise<ResumeItem | null> {
    const resumes = await this.getResumes();
    return resumes.find((r) => r.id === id) || null;
  },

  /**
   * Creates a new resume draft.
   */
  async createResume(data: Partial<ResumeItem>): Promise<ResumeItem> {
    const newResume: ResumeItem = {
      id: 'res_' + Math.random().toString(36).substring(2, 9),
      title: data.title || 'Untitled Tailored Resume',
      targetJobTitle: data.targetJobTitle || 'Target Role',
      targetCompany: data.targetCompany || '',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      version: 'v1.0',
      format: data.format || 'ATS Minimalist',
      score: data.score || 70,
      scoreGrade: 'Competitive',
      pageCount: 1,
      wordCount: 350,
      tags: data.tags || ['General'],
      summarySnippet: data.summarySnippet || 'Draft career dossier tailored for target job description.',
    };

    const current = await this.getResumes();
    const updated = [newResume, ...current];
    localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(updated));
    return newResume;
  },

  /**
   * Duplicates an existing resume.
   */
  async duplicateResume(id: string): Promise<ResumeItem | null> {
    const current = await this.getResumes();
    const original = current.find((r) => r.id === id);
    if (!original) return null;

    const duplicated: ResumeItem = {
      ...original,
      id: 'res_' + Math.random().toString(36).substring(2, 9),
      title: `${original.title} (Copy)`,
      version: 'v1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [duplicated, ...current];
    localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(updated));
    return duplicated;
  },

  /**
   * Deletes a resume.
   */
  async deleteResume(id: string): Promise<boolean> {
    const current = await this.getResumes();
    const updated = current.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(updated));
    return true;
  },

  /**
   * Updates resume details.
   */
  async updateResume(id: string, updates: Partial<ResumeItem>): Promise<ResumeItem | null> {
    const current = await this.getResumes();
    const index = current.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const updatedResume: ResumeItem = {
      ...current[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    current[index] = updatedResume;
    localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(current));
    return updatedResume;
  },
};
