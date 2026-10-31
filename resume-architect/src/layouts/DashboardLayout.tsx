import React, { useState } from 'react';
import { Sidebar, DashboardTab } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';

interface DashboardLayoutProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onCreateClick: () => void;
  onReviewClick: () => void;
  resumeCount?: number;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onSelectTab,
  onCreateClick,
  onReviewClick,
  resumeCount = 3,
  children,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex selection:bg-[#1B4332] selection:text-white">
      {/* Persistent Left Sidebar (Desktop: 256px wide fixed; Mobile: sliding drawer) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        resumeCount={resumeCount}
      />

      {/* Main Content Area (Offset by 256px on lg screens) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <DashboardHeader
          currentTab={currentTab}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onCreateClick={onCreateClick}
          onReviewClick={onReviewClick}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
