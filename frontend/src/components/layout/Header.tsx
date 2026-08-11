'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  PanelLeft,
  Search,
  Columns3,
  Filter,
  Plus,
  Menu,
  X,
  LayoutGrid,
  List,
  Check,
  ChevronRight,
  CircleDot,
  Signal,
  Users,
  Calendar,
  Tag,
  User,
} from 'lucide-react';

export interface VisibleFields {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}

interface HeaderProps {
  title?: string;
  viewMode?: 'kanban' | 'list';
  onViewChange?: (mode: 'kanban' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  priorityFilter?: string;
  onPriorityFilterChange?: (priority: string) => void;
  onOpenAddTask: () => void;
  onToggleSidebar?: () => void;
  onToggleMobileSidebar?: () => void;
  onOpenFields?: () => void;
  onOpenFilter?: () => void;
  visibleFields?: VisibleFields;
  onToggleField?: (field: keyof VisibleFields) => void;
}

export function Header({
  title = 'Tasks',
  viewMode = 'kanban',
  onViewChange,
  searchQuery,
  onSearchChange,
  statusFilter = 'All',
  onStatusFilterChange,
  priorityFilter = 'All',
  onPriorityFilterChange,
  onOpenAddTask,
  onToggleSidebar,
  onToggleMobileSidebar,
  onOpenFields,
  onOpenFilter,
  visibleFields,
  onToggleField,
}: HeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showFieldsMenu, setShowFieldsMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilterSubmenu, setActiveFilterSubmenu] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearchExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchExpanded]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fieldsRef.current && !fieldsRef.current.contains(event.target as Node)) {
        setShowFieldsMenu(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false);
        setActiveFilterSubmenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCloseSearch = () => {
    setIsSearchExpanded(false);
    onSearchChange('');
  };

  const handleFieldsClick = () => {
    setShowFieldsMenu(!showFieldsMenu);
    setShowFilterMenu(false);
    onOpenFields?.();
  };

  const handleFilterClick = () => {
    setShowFilterMenu(!showFilterMenu);
    setShowFieldsMenu(false);
    onOpenFilter?.();
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      {/* Top Navbar Row */}
      <div className="flex items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800/60">
        <button
          onClick={onToggleMobileSidebar}
          className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 lg:hidden"
          aria-label="Open mobile sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex p-1 text-slate-600 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          aria-label="Toggle sidebar"
          title="Hide/Show Sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Main Page Header Bar */}
      <header className="flex items-center justify-between px-6 py-4 relative">
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h1>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2.5">
          {/* Collapsible Search Input */}
          <div className="relative flex items-center">
            {!isSearchExpanded ? (
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="p-1.5 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                aria-label="Expand search"
              >
                <Search className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              </button>
            ) : (
              <div className="relative flex items-center w-64 animate-in fade-in zoom-in-95 duration-150">
                <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-8 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600"
                />
                <button
                  onClick={handleCloseSearch}
                  className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Fields Button & Dropdown */}
          <div className="relative" ref={fieldsRef}>
            <button
              onClick={handleFieldsClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                showFieldsMenu ? 'ring-2 ring-slate-400/20' : ''
              }`}
            >
              <Columns3 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>Fields</span>
            </button>

            {showFieldsMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-3 font-sans">
                {/* Segment Control Toggle Bar: List vs Board */}
                <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60 dark:border-slate-700/60">
                  <button
                    onClick={() => onViewChange?.('list')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>List</span>
                  </button>

                  <button
                    onClick={() => onViewChange?.('kanban')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'kanban'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Board</span>
                  </button>
                </div>

                {/* Fields List */}
                <div className="space-y-0.5 pt-1">
                  {[
                    { key: 'priority' as const, label: 'Priority' },
                    { key: 'members' as const, label: 'Members' },
                    { key: 'dueDate' as const, label: 'Due Date' },
                    { key: 'labels' as const, label: 'Labels' },
                    { key: 'status' as const, label: 'Status' },
                    { key: 'reporter' as const, label: 'Reporter' },
                  ].map((item) => {
                    const isChecked = visibleFields ? visibleFields[item.key] : true;
                    return (
                      <button
                        key={item.key}
                        onClick={() => onToggleField?.(item.key)}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                      >
                        <span>{item.label}</span>
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                              : 'bg-slate-200 dark:bg-slate-700/60'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Filter Button & Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={handleFilterClick}
              className={`p-1.5 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative ${
                statusFilter !== 'All' || priorityFilter !== 'All' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : ''
              }`}
              aria-label="Filter tasks"
            >
              <Filter className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-0.5">
                {/* Status Option with Submenu */}
                <div
                  className="relative group"
                  onMouseEnter={() => setActiveFilterSubmenu('status')}
                >
                  <button
                    onClick={() => setActiveFilterSubmenu(activeFilterSubmenu === 'status' ? null : 'status')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <CircleDot className="w-3.5 h-3.5 text-slate-400" />
                      <span>Status</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Status Submenu Popover */}
                  {activeFilterSubmenu === 'status' && (
                    <div className="absolute right-full top-0 mr-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-0.5">
                      <div className="px-2 py-1 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <span className="text-[11px] font-semibold text-slate-400">Status</span>
                      </div>
                      {['All', 'To Do', 'Doing', 'Completed', 'On Hold'].map((st) => (
                        <button
                          key={st}
                          onClick={() => {
                            onStatusFilterChange?.(st);
                            setShowFilterMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span>{st === 'All' ? 'All Statuses' : st}</span>
                          {statusFilter === st && <Check className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Priority Option with Submenu */}
                <div
                  className="relative group"
                  onMouseEnter={() => setActiveFilterSubmenu('priority')}
                >
                  <button
                    onClick={() => setActiveFilterSubmenu(activeFilterSubmenu === 'priority' ? null : 'priority')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Signal className="w-3.5 h-3.5 text-slate-400" />
                      <span>Priority</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Priority Submenu Popover (Matching Figma image) */}
                  {activeFilterSubmenu === 'priority' && (
                    <div className="absolute right-full top-0 mr-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-0.5">
                      <div className="px-2 py-1 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <span className="text-[11px] font-semibold text-slate-400">Priority</span>
                      </div>
                      {[
                        { label: 'All', color: 'text-slate-500' },
                        { label: 'No Priority', color: 'text-slate-400' },
                        { label: 'Urgent', color: 'text-red-500 font-semibold' },
                        { label: 'High', color: 'text-rose-500' },
                        { label: 'Medium', color: 'text-amber-500' },
                        { label: 'Low', color: 'text-slate-500' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            onPriorityFilterChange?.(item.label === 'No Priority' ? 'Low' : item.label);
                            setShowFilterMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Signal className={`w-3.5 h-3.5 ${item.color}`} />
                            <span className={item.color}>{item.label}</span>
                          </div>
                          {(priorityFilter === item.label || (item.label === 'No Priority' && priorityFilter === 'Low')) && (
                            <Check className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Members Option */}
                <div className="relative group" onMouseEnter={() => setActiveFilterSubmenu('members')}>
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Members</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {activeFilterSubmenu === 'members' && (
                    <div className="absolute right-full top-0 mr-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <p className="text-[11px] font-semibold text-slate-400 mb-1.5 px-1">Members</p>
                      <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" className="w-4 h-4 rounded-full" alt="Admin" />
                        <span>Admin</span>
                        <Check className="w-3.5 h-3.5 ml-auto text-slate-700 dark:text-slate-200" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Due Date Option */}
                <div className="relative group" onMouseEnter={() => setActiveFilterSubmenu('dueDate')}>
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due Date</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                {/* Teams Option */}
                <div className="relative group" onMouseEnter={() => setActiveFilterSubmenu('teams')}>
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Teams</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                {/* Labels Option */}
                <div className="relative group" onMouseEnter={() => setActiveFilterSubmenu('labels')}>
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span>Labels</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                {/* Reporter Option */}
                <div className="relative group" onMouseEnter={() => setActiveFilterSubmenu('reporter')}>
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reporter</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                {(statusFilter !== 'All' || priorityFilter !== 'All') && (
                  <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        onStatusFilterChange?.('All');
                        onPriorityFilterChange?.('All');
                        setShowFilterMenu(false);
                      }}
                      className="w-full text-center text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline py-1"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Add Task Button */}
          <button
            onClick={onOpenAddTask}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-md text-xs font-medium shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </header>
    </div>
  );
}