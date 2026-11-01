import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ResumeItem } from '../../types';
import { CANONICAL_BENCHMARK_EVALUATION } from '../../utils/scoreCalculation';
import { ScoreDisplay } from '../score-engine/ScoreDisplay';
import { CategoryScoreBreakdown } from '../score-engine/CategoryScoreBreakdown';
import { Button } from '../common/Button';
import {
  Gauge,
  FilePlus,
  Edit3,
  Share2,
  FolderArchive,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DashboardTab } from './Sidebar';

interface HomeOverviewProps {
  resumes: ResumeItem[];
  onSelectTab: (tab: DashboardTab) => void;
  onSelectResumeToReview: (resume: ResumeItem) => void;
  onSelectResumeToEdit: (resume: ResumeItem) => void;
  onCreateClick: () => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  resumes,
  onSelectTab,
  onSelectResumeToReview,
  onSelectResumeToEdit,
  onCreateClick,
}) => {
  const { user } = useAuth();
  const evaluation = CANONICAL_BENCHMARK_EVALUATION;

  // Compute average score across resumes
  const avgScore =
    resumes.length > 0
      ? Math.round(resumes.reduce((acc, r) => acc + (r.score || 0), 0) / resumes.length)
      : 82;

  return (
    <div className="space-y-8">
      {/* Welcome & Context Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E1D7] p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF2EC] text-[#1B4332] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authenticated Tools Dashboard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C201D]">
            Welcome back, {user?.name || 'Candidate'}
          </h2>
          <p className="text-xs sm:text-sm text-[#57605A] max-w-xl">
            Analyze your resume compatibility against specific job postings, discover missing keywords,
            and engineer evidence-backed resumes calibrated for hiring committees.
          </p>
        </div>

        <div className="flex flex-row md:flex-col gap-4 border-t md:border-t-0 md:border-l border-[#E5E1D7] pt-4 md:pt-0 md:pl-6 shrink-0">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#848E88] block">
              Active Resumes
            </span>
            <span className="text-2xl font-bold font-mono text-[#1C201D] tabular-nums">
              {resumes.length}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#848E88] block">
              Avg. Match Score
            </span>
            <span className="text-2xl font-bold font-mono text-[#1B4332] tabular-nums">
              {avgScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Tools Hub (The 4 Core Platform Tools) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1C201D]">Platform Tools Hub</h3>
            <p className="text-xs text-[#57605A]">
              Select a specialized tool to analyze, create, refine, or showcase your career qualifications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tool 1: Review & Score Engine */}
          <div
            onClick={() => onSelectTab('review')}
            className="p-5 rounded-2xl bg-white border border-[#E5E1D7] shadow-card hover:border-[#1B4332] hover:shadow-elevated transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EBF2EC] text-[#1B4332] flex items-center justify-center mb-4 group-hover:bg-[#1B4332] group-hover:text-white transition-colors">
                <Gauge className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1B4332] block mb-1">
                Central Engine
              </span>
              <h4 className="font-bold text-base text-[#1C201D] mb-1">Review Resume</h4>
              <p className="text-xs text-[#57605A] leading-relaxed">
                Analyse resumes against job descriptions and calculate a transparent 6-pillar match score.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#F0ECE1] flex items-center justify-between text-xs font-semibold text-[#1B4332]">
              <span>Launch Score Engine</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Tool 2: Resume Builder */}
          <div
            onClick={() => onSelectTab('create')}
            className="p-5 rounded-2xl bg-white border border-[#E5E1D7] shadow-card hover:border-[#1B4332] hover:shadow-elevated transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5E1D7] text-[#1B4332] flex items-center justify-center mb-4 group-hover:bg-[#1B4332] group-hover:text-white transition-colors">
                <FilePlus className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#848E88] block mb-1">
                Creation Suite
              </span>
              <h4 className="font-bold text-base text-[#1C201D] mb-1">Create Resume</h4>
              <p className="text-xs text-[#57605A] leading-relaxed">
                Create ATS-conscious resumes with single-column semantic parsing structure and clean typography.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#F0ECE1] flex items-center justify-between text-xs font-semibold text-[#1B4332]">
              <span>Build New Resume</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Tool 3: Resume Editor */}
          <div
            onClick={() => onSelectTab('editor')}
            className="p-5 rounded-2xl bg-white border border-[#E5E1D7] shadow-card hover:border-[#1B4332] hover:shadow-elevated transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5E1D7] text-[#1B4332] flex items-center justify-center mb-4 group-hover:bg-[#1B4332] group-hover:text-white transition-colors">
                <Edit3 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#848E88] block mb-1">
                Refinement
              </span>
              <h4 className="font-bold text-base text-[#1C201D] mb-1">Resume Editor</h4>
              <p className="text-xs text-[#57605A] leading-relaxed">
                Fine-tune work experience bullet points, quantify business outcomes, and eliminate fluff.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#F0ECE1] flex items-center justify-between text-xs font-semibold text-[#1B4332]">
              <span>Open Editor</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Tool 4: LinkedIn Optimizer */}
          <div
            onClick={() => onSelectTab('linkedin')}
            className="p-5 rounded-2xl bg-white border border-[#E5E1D7] shadow-card hover:border-[#1B4332] hover:shadow-elevated transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5E1D7] text-[#1B4332] flex items-center justify-center mb-4 group-hover:bg-[#1B4332] group-hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#848E88] block mb-1">
                Public Profile
              </span>
              <h4 className="font-bold text-base text-[#1C201D] mb-1">LinkedIn Optimizer</h4>
              <p className="text-xs text-[#57605A] leading-relaxed">
                Improve LinkedIn headlines, About narrative summaries, and skill endorsements for recruiter searches.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#F0ECE1] flex items-center justify-between text-xs font-semibold text-[#1B4332]">
              <span>Optimize Profile</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Score Spotlight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1C201D]">Latest Score Engine Analysis</h3>
            <p className="text-xs text-[#57605A]">
              Deterministic compatibility evaluation for your target executive mandate.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('review')}
            className="text-xs font-semibold text-[#1B4332] hover:underline cursor-pointer"
          >
            Run New Job Analysis →
          </button>
        </div>

        <ScoreDisplay evaluation={evaluation} />
        <div className="bg-white rounded-2xl border border-[#E5E1D7] p-6 shadow-card">
          <CategoryScoreBreakdown categories={evaluation.categories} />
        </div>
      </div>

      {/* Resume History Sneak Peek */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1C201D]">Recent Resumes</h3>
            <p className="text-xs text-[#57605A]">
              {resumes.length} saved career dossiers in your local development workspace.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectTab('resumes')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View All in My Resumes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resumes.slice(0, 3).map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-2xl bg-white border border-[#E5E1D7] shadow-card flex flex-col justify-between hover:border-[#D6D1C4] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-semibold text-[#1B4332] bg-[#EBF2EC] px-2 py-0.5 rounded">
                    {res.version}
                  </span>
                  <span className="text-xs font-bold font-mono text-[#1C201D] tabular-nums">
                    {res.score}% Match
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#1C201D] line-clamp-1 mb-1">{res.title}</h4>
                <p className="text-xs text-[#57605A] line-clamp-1">{res.targetJobTitle}</p>
                <div className="flex items-center gap-2 text-[11px] text-[#848E88] mt-3">
                  <Clock className="w-3 h-3" />
                  <span>Updated {new Date(res.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F0ECE1] flex items-center justify-between">
                <button
                  onClick={() => onSelectResumeToReview(res)}
                  className="text-xs font-semibold text-[#1B4332] hover:underline cursor-pointer"
                >
                  Score Engine
                </button>
                <button
                  onClick={() => onSelectResumeToEdit(res)}
                  className="text-xs font-medium text-[#57605A] hover:text-[#1C201D] cursor-pointer"
                >
                  Edit Document
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
