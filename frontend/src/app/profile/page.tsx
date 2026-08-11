'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { SettingsView } from '@/components/dashboard/SettingsView';
import { fetchProjects } from '@/services/api';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchProjects()
        .then((res) => setProjects(Array.isArray(res) ? res : []))
        .catch((err) => console.error(err));
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-white" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      <Sidebar
        currentProject={null}
        onSelectProject={() => router.push('/dashboard')}
        projects={projects}
        onOpenAddProject={() => router.push('/dashboard')}
        activeView="settings"
        onSelectView={(v) => {
          if (v === 'tasks' || v === 'projects') {
            router.push('/dashboard');
          }
        }}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-auto p-4 sm:p-6">
        <SettingsView onBackToApp={() => router.push('/dashboard')} />
      </div>
    </div>
  );
}
