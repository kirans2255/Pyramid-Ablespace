import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme, ColorMode } from '@/context/ThemeContext';
import {
  LayoutGrid,
  FolderKanban,
  ChevronDown,
  ChevronUp,
  Plus,
  Sun,
  Square,
  Settings,
  ChevronRight,
  Check
} from 'lucide-react';

interface SidebarProps {
  currentProject: string | null;
  onSelectProject: (id: string | null) => void;
  projects: any[];
  onOpenAddProject: () => void;
  activeView: 'tasks' | 'projects' | 'settings';
  onSelectView: (view: 'tasks' | 'projects' | 'settings') => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  collapsed?: boolean;
}

export function Sidebar({
  currentProject,
  onSelectProject,
  projects,
  onOpenAddProject,
  activeView,
  onSelectView,
  mobileOpen,
  onCloseMobile,
  collapsed = false,
}: SidebarProps) {
  const { user } = useAuth();
  const { theme, colorMode, setTheme, setColorMode } = useTheme();
  const router = useRouter();

  const [workspaceOpen, setWorkspaceOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<'theme' | 'colorMode' | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
        setActiveSubmenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const userAvatar =
    user?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
  const userName = user?.name || user?.email?.split('@')[0] || 'Dexter';

  const colorModes: { id: ColorMode; name: string; color: string }[] = [
    { id: 'amber', name: 'Amber', color: 'bg-amber-500' },
    { id: 'blue', name: 'Blue', color: 'bg-indigo-600' },
    { id: 'pink', name: 'Pink', color: 'bg-pink-500' },
    { id: 'rose', name: 'Rose', color: 'bg-rose-500' },
    { id: 'emerald', name: 'Emerald', color: 'bg-emerald-500' },
    { id: 'black', name: 'Black', color: 'bg-black' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-200 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } ${collapsed ? 'lg:hidden' : ''}`}
      >
        {/* User / Account Header */}
        <div className="relative p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60" ref={userMenuRef}>
          <div className="flex items-center gap-2.5">
            <img
              src={userAvatar}
              alt={userName}
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
              {userName}
            </span>
          </div>
          <button
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setActiveSubmenu(null);
            }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="User options"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* User Options Dropdown Menu */}
          {userMenuOpen && (
            <div className="absolute top-14 left-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* Centered User Info */}
              <div className="flex flex-col items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-12 h-12 rounded-full object-cover mb-2"
                />
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{userName}</p>
                <p className="text-xs text-slate-400 truncate max-w-[200px]">
                  {user?.email || 'Dexter@gmail.com'}
                </p>
              </div>

              {/* Menu Options */}
              <div className="pt-2 space-y-1 relative">
                {/* Change Theme */}
                <div
                  className="relative"
                  onMouseEnter={() => setActiveSubmenu('theme')}
                >
                  <button
                    onClick={() => setActiveSubmenu(activeSubmenu === 'theme' ? null : 'theme')}
                    className="w-full flex items-center justify-between px-2 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sun className="w-4 h-4 text-slate-500" />
                      <span>Change Theme</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Theme Submenu Popup */}
                  {activeSubmenu === 'theme' && (
                    <div className="absolute left-full top-0 ml-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50">
                      <p className="px-2 py-1 text-[11px] text-slate-400 font-medium">Theme</p>
                      <button
                        onClick={() => setTheme('light')}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Sun className="w-3.5 h-3.5" />
                          <span>Light</span>
                        </div>
                        {theme === 'light' && <Check className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />}
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Sun className="w-3.5 h-3.5 rotate-180" />
                          <span>Dark</span>
                        </div>
                        {theme === 'dark' && <Check className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Color Mode */}
                <div
                  className="relative"
                  onMouseEnter={() => setActiveSubmenu('colorMode')}
                >
                  <button
                    onClick={() => setActiveSubmenu(activeSubmenu === 'colorMode' ? null : 'colorMode')}
                    className="w-full flex items-center justify-between px-2 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Square className="w-4 h-4 fill-indigo-600 text-indigo-600" />
                      <span>Color Mode</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Color Mode Submenu Popup */}
                  {activeSubmenu === 'colorMode' && (
                    <div className="absolute left-full top-0 ml-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50">
                      <p className="px-2 py-1 text-[11px] text-slate-400 font-medium">Color Mode</p>
                      {colorModes.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => setColorMode(mode.id)}
                          className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-3.5 h-3.5 rounded ${mode.color}`} />
                            <span>{mode.name}</span>
                          </div>
                          {colorMode === mode.id && (
                            <Check className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Settings */}
                <button
                  onClick={() => {
                    router.push('/profile');
                    onSelectView('settings');
                    onSelectProject(null);
                    setUserMenuOpen(false);
                    setActiveSubmenu(null);
                    onCloseMobile();
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* Workspace Header Toggle */}
          <button
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="w-full flex items-center justify-between px-2 py-1.5 mb-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Workspace
            </span>
            {workspaceOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* Tasks & Projects Collapsible List */}
          {workspaceOpen && (
            <div className="space-y-1">
              {/* Tasks Nav Item */}
              <button
                onClick={() => {
                  onSelectView('tasks');
                  onSelectProject(null);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeView === 'tasks' && !currentProject
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
              >
                <LayoutGrid className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span>Tasks</span>
              </button>

              {/* Projects Header & Add Button */}
              <div className="pt-2">
                <div className="flex items-center justify-between px-3 py-1.5">
                  <button
                    onClick={() => {
                      onSelectView('projects');
                      setProjectsOpen(!projectsOpen);
                    }}
                    className={`flex items-center gap-2.5 text-sm font-medium transition-colors ${activeView === 'projects' || currentProject
                        ? 'text-slate-900 dark:text-slate-100 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                  >
                    <FolderKanban className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span>Projects</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAddProject();
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Create New Project"
                    aria-label="Create New Project"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Projects List Sub-items */}
                {projectsOpen && (
                  <div className="pl-4 mt-1 space-y-0.5 border-l border-slate-100 dark:border-slate-800 ml-5">
                    {projects.length === 0 ? (
                      <p className="px-3 py-1.5 text-xs text-slate-400 italic">No projects yet</p>
                    ) : (
                      projects.map((project) => (
                        <button
                          key={project._id}
                          onClick={() => {
                            onSelectProject(project._id);
                            onSelectView('tasks');
                            onCloseMobile();
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${currentProject === project._id
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: project.color || '#3b82f6' }}
                          />
                          <span className="truncate">{project.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}