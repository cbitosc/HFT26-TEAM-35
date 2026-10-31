import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardTab } from '../components/dashboard/Sidebar';
import { HomeOverview } from '../components/dashboard/HomeOverview';
import { ResumeHistory } from '../components/dashboard/ResumeHistory';
import { ResumeStudioView } from '../components/studio/ResumeStudioView';
import { EditorView } from '../components/dashboard/EditorView';
import { LinkedInView } from '../components/dashboard/LinkedInView';
import { ProfileView } from '../components/dashboard/ProfileView';
import { SettingsView } from '../components/dashboard/SettingsView';
import { CreateResumeModal } from '../components/dashboard/CreateResumeModal';
import { ReviewResumeModal } from '../components/dashboard/ReviewResumeModal';
import { ResumeReviewerView } from '../components/reviewer/ResumeReviewerView';
import { resumeService } from '../services/resumeService';
import { ResumeItem } from '../types';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<DashboardTab>('home');
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeResumeForAction, setActiveResumeForAction] = useState<ResumeItem | null>(null);

  const { isAuthenticated } = useAuth();

  // Load resumes
  const loadResumes = async () => {
    setIsLoading(true);
    try {
      const data = await resumeService.getResumes();
      setResumes(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleSelectTab = (tab: DashboardTab) => {
    if (tab === 'review') {
      setActiveResumeForAction(resumes[0] || null);
      setCurrentTab('review');
      return;
    }
    setCurrentTab(tab);
  };

  const handleCreateResume = async (data: Partial<ResumeItem>) => {
    const created = await resumeService.createResume(data);
    await loadResumes();
    setActiveResumeForAction(created);
  };

  const handleDuplicateResume = async (id: string) => {
    await resumeService.duplicateResume(id);
    await loadResumes();
  };

  const handleDeleteResume = async (id: string) => {
    await resumeService.deleteResume(id);
    await loadResumes();
  };

  const handleSelectResumeToReview = (resume: ResumeItem) => {
    setActiveResumeForAction(resume);
    setCurrentTab('review');
  };

  const handleSelectResumeToEdit = (resume: ResumeItem) => {
    setActiveResumeForAction(resume);
    setCurrentTab('editor');
  };

  return (
    <DashboardLayout
      currentTab={currentTab}
      onSelectTab={handleSelectTab}
      onCreateClick={() => setCurrentTab('create')}
      onReviewClick={() => {
        setActiveResumeForAction(resumes[0] || null);
        setCurrentTab('review');
      }}
      resumeCount={resumes.length}
    >
      {currentTab === 'home' && (
        <HomeOverview
          resumes={resumes}
          onSelectTab={handleSelectTab}
          onSelectResumeToReview={handleSelectResumeToReview}
          onSelectResumeToEdit={handleSelectResumeToEdit}
          onCreateClick={() => setCurrentTab('create')}
        />
      )}

      {currentTab === 'create' && (
        <ResumeStudioView
          resumes={resumes}
          onSaveNewResume={async (data) => {
            await handleCreateResume(data);
          }}
          onLaunchReviewer={handleSelectResumeToReview}
        />
      )}

      {currentTab === 'review' && (
        <ResumeReviewerView
          resumes={resumes}
          initialSelectedResume={activeResumeForAction}
          onNavigateToStudio={(resume) => {
            if (resume) setActiveResumeForAction(resume);
            setCurrentTab('create');
          }}
          onNavigateToResumes={() => setCurrentTab('resumes')}
        />
      )}

      {currentTab === 'resumes' && (
        <ResumeHistory
          resumes={resumes}
          onSelectResumeToReview={handleSelectResumeToReview}
          onSelectResumeToEdit={handleSelectResumeToEdit}
          onDuplicateResume={handleDuplicateResume}
          onDeleteResume={handleDeleteResume}
          onCreateNewClick={() => setCurrentTab('create')}
        />
      )}

      {currentTab === 'editor' && (
        <EditorView
          resumes={resumes}
          initialResume={activeResumeForAction}
        />
      )}

      {currentTab === 'linkedin' && <LinkedInView resumes={resumes} />}

      {currentTab === 'profile' && <ProfileView />}

      {currentTab === 'settings' && <SettingsView />}

      {/* Review Modal */}
      <ReviewResumeModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        resumes={resumes}
        initialResume={activeResumeForAction}
        onOpenFullWorkspace={() => {
          setReviewModalOpen(false);
          setCurrentTab('review');
        }}
      />

      {/* Quick Create Modal (optional quick modal) */}
      <CreateResumeModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={async (data) => {
          await handleCreateResume(data);
          setCurrentTab('resumes');
        }}
      />
    </DashboardLayout>
  );
};
