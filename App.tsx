import React, { useState, useCallback } from 'react';
import { Issue, User, Status, Project } from './types';
import { MOCK_ISSUES, MOCK_USERS, MOCK_PROJECTS, STATUSES } from './constants';
import Column from './components/Column';
import IssueModal from './components/IssueModal';
import ProjectModal from './components/ProjectModal';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(MOCK_PROJECTS[0]?.id || null);
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);
  const [users] = useState<User[]>(MOCK_USERS);
  
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const handleSelectIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsIssueModalOpen(true);
  };
  
  const handleOpenCreateIssueModal = () => {
    if (!selectedProjectId) {
      alert("Please select a project before creating an issue.");
      return;
    }
    setSelectedIssue(null);
    setIsIssueModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsIssueModalOpen(false);
    setIsProjectModalOpen(false);
    setSelectedIssue(null);
  };

  const handleSaveIssue = (issueToSave: Issue) => {
    const issueExists = issues.some(i => i.id === issueToSave.id);
    if (issueExists) {
      setIssues(issues.map(i => i.id === issueToSave.id ? issueToSave : i));
    } else {
      setIssues([...issues, issueToSave]);
    }
    handleCloseModal();
  };
  
  const handleDeleteIssue = (issueId: string) => {
    setIssues(issues.filter(i => i.id !== issueId));
    handleCloseModal();
  }

  const handleSaveProject = (projectToSave: Project) => {
    setProjects([...projects, projectToSave]);
    setSelectedProjectId(projectToSave.id);
    handleCloseModal();
  }

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, issueId: string) => {
    e.dataTransfer.setData('issueId', issueId);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Status) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData('issueId');
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );
  };
  
  const getFilteredIssuesByStatus = useCallback((status: Status) => {
    if (!selectedProjectId) return [];
    return issues.filter(issue => issue.projectId === selectedProjectId && issue.status === status);
  }, [issues, selectedProjectId]);

  return (
    <div className="flex flex-col h-screen bg-neutral-light font-sans text-neutral-darkest">
      <header className="bg-white shadow-md p-4 flex justify-between items-center z-10 flex-shrink-0">
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <svg className="w-8 h-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h1 className="text-2xl font-bold">Bug Tracker</h1>
            </div>
            <div className="flex items-center space-x-2">
                <select 
                    value={selectedProjectId || ''} 
                    onChange={e => setSelectedProjectId(e.target.value)}
                    className="border-neutral-medium rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary font-semibold"
                >
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button 
                  onClick={() => setIsProjectModalOpen(true)}
                  className="bg-neutral-dark text-white font-semibold px-3 py-2 text-sm rounded-lg hover:bg-neutral-darkest transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  New Project
                </button>
            </div>
        </div>
        <button 
          onClick={handleOpenCreateIssueModal}
          className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          disabled={!selectedProjectId}
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          New Issue
        </button>
      </header>
      <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-x-auto">
        {selectedProjectId ? (
          <div className="flex space-x-6 h-full min-w-max">
            {STATUSES.map(status => (
              <Column
                key={status}
                status={status}
                issues={getFilteredIssuesByStatus(status)}
                users={users}
                onSelectIssue={handleSelectIssue}
                onDragStart={onDragStart}
                onDrop={onDrop}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-neutral-dark">No Project Selected</h2>
              <p className="mt-2 text-neutral-darkest">Please select a project from the dropdown or create a new one to get started.</p>
            </div>
          </div>
        )}
      </main>
      
      {isIssueModalOpen && selectedProjectId && (
        <IssueModal
            isOpen={isIssueModalOpen}
            onClose={handleCloseModal}
            issue={selectedIssue}
            users={users}
            onSave={handleSaveIssue}
            onDelete={handleDeleteIssue}
            projectId={selectedProjectId}
        />
      )}
      
      <ProjectModal 
        isOpen={isProjectModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProject}
      />
    </div>
  );
};

export default App;