import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { ChatView } from '../chat/ChatView';
import { DocumentsView } from '../documents/DocumentsView';
import { SettingsModal } from '../settings/SettingsModal';
import { AppTab, DocumentMetadata } from '../../types';
import { api } from '../../services/api';

interface DashboardLayoutProps {
  onReturnToLanding: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onReturnToLanding }) => {
  const [activeTab, setActiveTab] = useState<AppTab>('chat');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [totalVectors, setTotalVectors] = useState(0);

  const refreshSystemData = async () => {
    try {
      const docRes = await api.getDocuments();
      setDocuments(docRes.documents);
      setTotalVectors(docRes.total_chunks);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    refreshSystemData();
  }, []);

  const handleNewChat = () => {
    setActiveTab('chat');
    // Triggers chat reset via re-render or tab switch
  };

  return (
    <div className="flex h-screen w-full bg-background-darkest overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onReturnToLanding={onReturnToLanding}
        onNewChat={handleNewChat}
        documents={documents}
        totalVectors={totalVectors}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopHeader
          activeTab={activeTab}
          onOpenUpload={() => setActiveTab('documents')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          documents={documents}
          totalVectors={totalVectors}
        />

        {/* Tab View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'chat' && (
            <ChatView
              documents={documents}
              onOpenUpload={() => setActiveTab('documents')}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsView />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigSaved={refreshSystemData}
      />

    </div>
  );
};
