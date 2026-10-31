import React from 'react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  FilePlus,
  Gauge,
  Edit3,
  Share2,
  FolderArchive,
  User,
  Settings,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react';

export type DashboardTab =
  | 'home'
  | 'create'
  | 'review'
  | 'editor'
  | 'linkedin'
  | 'resumes'
  | 'profile'
  | 'settings';

interface SidebarProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  resumeCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  resumeCount = 3,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'home' as DashboardTab, label: 'Home', icon: Home },
    { id: 'create' as DashboardTab, label: 'AI Resume Studio', icon: FilePlus },
    { id: 'review' as DashboardTab, label: 'Review Resume', icon: Gauge },
    { id: 'editor' as DashboardTab, label: 'Resume Editor', icon: Edit3 },
    { id: 'linkedin' as DashboardTab, label: 'LinkedIn Optimizer', icon: Share2 },
    {
      id: 'resumes' as DashboardTab,
      label: 'My Resumes',
      icon: FolderArchive,
      badge: resumeCount.toString(),
    },
    { id: 'profile' as DashboardTab, label: 'Profile', icon: User },
    { id: 'settings' as DashboardTab, label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: DashboardTab) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  const handleLogout = async () => {
    onCloseMobile();
    await logout();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#E5E1D7] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Logo */}
        <div>
          <div className="h-16 px-6 border-b border-[#E5E1D7] flex items-center justify-between">
            <Logo isLink={false} />
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-[#57605A] hover:text-[#1C201D] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold tracking-wider uppercase text-[#848E88]">
              Platform Tools
            </div>
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#1B4332] text-white shadow-sm'
                      : 'text-[#57605A] hover:text-[#1C201D] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#848E88]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#F3EFE7] text-[#1C201D]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 px-3 py-2 text-[11px] font-semibold tracking-wider uppercase text-[#848E88]">
              Account & Setup
            </div>
            {navItems.slice(6).map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#1B4332] text-white shadow-sm'
                      : 'text-[#57605A] hover:text-[#1C201D] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#848E88]'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Candidate Status & Logout */}
        <div className="p-3 border-t border-[#E5E1D7] space-y-2">
          {/* Candidate Card */}
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E1D7] flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-xs font-bold text-[#1C201D] block truncate">
                {user?.name || 'Candidate'}
              </span>
              <span className="text-[11px] text-[#57605A] block truncate">
                {user?.email || 'user@example.com'}
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>
          </div>

          {/* Logout Action (Item 9) */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#8C2E2E] hover:bg-red-50 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <LogOut className="w-4 h-4 text-[#8C2E2E]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
