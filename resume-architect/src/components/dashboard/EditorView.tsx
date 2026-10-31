import React, { useState } from 'react';
import { ResumeItem } from '../../types';
import { Button } from '../common/Button';
import { Edit3, Check, Sparkles, FileText, Plus, Trash2, ArrowUpRight } from 'lucide-react';

interface EditorViewProps {
  resumes: ResumeItem[];
  initialResume?: ResumeItem | null;
  onSave?: (updated: Partial<ResumeItem>) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  resumes,
  initialResume,
  onSave,
}) => {
  const [selectedResumeId, setSelectedResumeId] = useState<string>(
    initialResume?.id || (resumes[0]?.id ?? '')
  );
  const selectedResume = resumes.find((r) => r.id === selectedResumeId) || resumes[0];

  const [bullets, setBullets] = useState<string[]>([
    'Architected event-driven decoupling of core payment ledger into 18 Go microservices on EKS.',
    'Sustained 99.999% uptime across 8.4M peak daily transactions while slashing p99 latency from 142ms to 6.8ms.',
    'Engineered automated canary pipeline with Prometheus metric validation, eliminating rollback incidents in 2025.',
  ]);

  const [newBullet, setNewBullet] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  const handleAddBullet = () => {
    if (newBullet.trim()) {
      setBullets([...bullets, newBullet.trim()]);
      setNewBullet('');
    }
  };

  const handleRemoveBullet = (index: number) => {
    setBullets(bullets.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B4332] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-elevated flex items-center gap-2">
          <Check className="w-4 h-4 text-[#A3C4B0]" />
          <span>Resume bullet revisions saved successfully.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C201D] flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#1B4332]" />
            <span>Resume Editor & Evidence Architect</span>
          </h2>
          <p className="text-xs text-[#57605A]">
            Refine achievement bullet points with quantifiable scope, architectural decisions, and
            verifiable outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
            className="text-xs text-[#1C201D] bg-white border border-[#E5E1D7] rounded-xl px-3 py-2 outline-none shadow-subtle cursor-pointer"
          >
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
          <Button variant="primary" size="sm" onClick={handleSave} leftIcon={<Check className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Work Experience Bullets */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E5E1D7] p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1]">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B4332] block">
                Target Role
              </span>
              <h3 className="text-base font-bold text-[#1C201D]">
                {selectedResume?.targetJobTitle || 'Staff Distributed Systems Engineer'}
              </h3>
            </div>
            <span className="text-xs font-mono text-[#848E88] bg-[#FAF8F5] px-2 py-1 rounded border border-[#E5E1D7]">
              Format: {selectedResume?.format || 'ATS Minimalist'}
            </span>
          </div>

          {/* Bullet points editor */}
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-[#1C201D]">
              Evidence Bullet Points (Impact Vectors)
            </label>

            <div className="space-y-3">
              {bullets.map((b, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E1D7] flex items-start justify-between gap-3 group hover:border-[#1B4332] transition-colors"
                >
                  <div className="flex items-start gap-2.5 flex-1">
                    <span className="text-xs font-mono font-bold text-[#1B4332] mt-0.5">
                      {idx + 1}.
                    </span>
                    <p className="text-xs text-[#1C201D] font-medium leading-relaxed">{b}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveBullet(idx)}
                    className="text-[#848E88] hover:text-[#8C2E2E] p-1 rounded transition-colors cursor-pointer"
                    title="Remove bullet point"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add bullet input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Draft another quantified bullet (Decision + Scale + Outcome)..."
                value={newBullet}
                onChange={(e) => setNewBullet(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddBullet();
                  }
                }}
                className="flex-1 text-xs text-[#1C201D] bg-[#FAF8F5] border border-[#E5E1D7] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1B4332] focus:bg-white shadow-subtle"
              />
              <Button variant="secondary" size="sm" onClick={handleAddBullet} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Evidence Formulation Guidance */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E5E1D7] p-6 shadow-subtle space-y-4">
            <h4 className="text-sm font-bold text-[#1C201D] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#1B4332]" />
              <span>Evidence Formulation Rule</span>
            </h4>
            <p className="text-xs text-[#57605A] leading-relaxed">
              Every bullet point must combine an explicit technical action, boundary scale, and
              verifiable metric:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white rounded-lg border border-[#E5E1D7] space-y-1">
                <span className="font-semibold text-[#1B4332] block">Action & Protocol</span>
                <span className="text-[#57605A]">e.g. Decoupled monolith into 18 Go microservices</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#E5E1D7] space-y-1">
                <span className="font-semibold text-[#1B4332] block">Operational Scale</span>
                <span className="text-[#57605A]">e.g. 8.4M peak daily transactions</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#E5E1D7] space-y-1">
                <span className="font-semibold text-[#1B4332] block">Measurable Delta</span>
                <span className="text-[#57605A]">e.g. p99 latency dropped from 142ms to 6.8ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
