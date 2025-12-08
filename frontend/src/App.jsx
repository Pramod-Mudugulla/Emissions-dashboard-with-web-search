import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ChatPanel from './components/ChatPanel';
import { LayoutDashboard, MessageSquare, Settings, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => {
  return twMerge(clsx(inputs));
}

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-200 group",
      active
        ? "bg-primary text-primary-foreground shadow-md"
        : "text-muted-foreground hover:bg-white/5 hover:text-white"
    )}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-white/5 flex flex-col p-4 m-4 rounded-2xl relative z-10">
        <div className="flex items-center space-x-2 px-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="text-primary-foreground" size={20} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            EcoTracker
          </span>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <SidebarItem
            icon={MessageSquare}
            label="AI Assistant"
            active={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 pl-0">
        <div className="h-full rounded-2xl glass-panel relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="relative z-10 h-full overflow-hidden">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'chat' && <ChatPanel />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
