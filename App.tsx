import React, { useState, useEffect } from 'react';
import { DUMMY_USERS, DUMMY_PROJECTS, DUMMY_ISSUES } from './constants';
import { Project, Issue, User, Status } from './types';
import Column from './components/Column';
import IssueModal from './components/IssueModal';
import ProjectModal from './components/ProjectModal';
import AuthPage from './components/AuthPage';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isIssueModalOpen, setIssueModalOpen] = useState(false);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  
  // Load initial data
  useEffect(() => {
    // In a real app, this would be an API call
    setProjects(DUMMY_PROJECTS);
    setIssues(DUMMY_ISSUES);
    setUsers(DUMMY_USERS);
    if (DUMMY_PROJECTS.length > 0) {
      setSelectedProject(DUMMY_PROJECTS[0]);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleSignup = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };
  
  const handleSelectIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setIssueModalOpen(true);
  };

  const handleCloseIssueModal = () => {
    setIssueModalOpen(false);
    setSelectedIssue(null);
  };
  
  const handleSaveIssue = (issueToSave: Issue) => {
    const issueIndex = issues.findIndex(i => i.id === issueToSave.id);
    if (issueIndex > -1) {
      const newIssues = [...issues];
      newIssues[issueIndex] = issueToSave;
      setIssues(newIssues);
    } else {
      setIssues([...issues, issueToSave]);
    }
    handleCloseIssueModal();
  };

  const handleDeleteIssue = (issueId: string) => {
    setIssues(issues.filter(i => i.id !== issueId));
    handleCloseIssueModal();
  };

  const handleSaveProject = (projectToSave: Project) => {
    setProjects([...projects, projectToSave]);
    if (!selectedProject) {
        setSelectedProject(projectToSave);
    }
    setProjectModalOpen(false);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, issueId: string) => {
    e.dataTransfer.setData("issueId", issueId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
    const issueId = e.dataTransfer.getData("issueId");
    const newIssues = issues.map(issue => {
      if (issue.id === issueId) {
        return { ...issue, status };
      }
      return issue;
    });
    setIssues(newIssues);
  };
  
  const filteredIssues = selectedProject
    ? issues.filter(issue => issue.projectId === selectedProject.id)
    : [];

  const issuesByStatus = {
    [Status.TODO]: filteredIssues.filter(i => i.status === Status.TODO),
    [Status.IN_PROGRESS]: filteredIssues.filter(i => i.status === Status.IN_PROGRESS),
    [Status.DONE]: filteredIssues.filter(i => i.status === Status.DONE),
  };

  if (!currentUser) {
    return <AuthPage users={users} onLogin={handleLogin} onSignup={handleSignup} />;
  }

  return (
    <div className="bg-background min-h-screen font-sans text-text-main flex flex-col">
      <header className="bg-surface border-b border-border p-4 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm bg-surface/90">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center font-mono font-bold text-white text-lg">
                    BT
                </div>
                <h1 className="text-xl font-bold font-mono tracking-tight">Bug_Tracker<span className="text-primary">.exe</span></h1>
            </div>
            
            <div className="hidden md:flex items-center bg-surface-highlight border border-border rounded-md px-3 py-1">
                <span className="text-text-muted text-xs font-mono mr-2">PROJECT:</span>
                <select 
                value={selectedProject?.id || ''} 
                onChange={(e) => setSelectedProject(projects.find(p => p.id === e.target.value) || null)}
                className="bg-transparent border-none text-sm font-semibold focus:ring-0 text-text-main cursor-pointer outline-none min-w-[150px]"
                >
                {projects.map(p => <option key={p.id} value={p.id} className="bg-surface">{p.name}</option>)}
                </select>
            </div>

            <button onClick={() => setProjectModalOpen(true)} className="text-xs font-mono text-primary hover:text-accent transition-colors border border-primary/30 hover:border-accent/50 rounded px-2 py-1">
              + NEW_PROJECT
            </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="font-mono text-xs text-primary">{currentUser.name}</p>
            <button onClick={handleLogout} className="text-xs text-text-muted hover:text-white transition-colors">Disconnect</button>
          </div>
          <button 
            onClick={() => { setSelectedIssue(null); setIssueModalOpen(true); }} 
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-background font-bold rounded-md shadow-glow transition-all duration-200 flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Issue
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-x-auto">
        {selectedProject ? (
          <div className="flex flex-col md:flex-row gap-6 min-w-full md:min-w-0 h-full">
            {Object.values(Status).map(status => (
              <Column
                key={status}
                status={status}
                issues={issuesByStatus[status]}
                users={users}
                onSelectIssue={handleSelectIssue}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-80">
            <div className="w-20 h-20 mb-6 border-2 border-dashed border-text-muted rounded-xl flex items-center justify-center">
                <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h2 className="text-3xl font-bold mb-2 font-mono">No Project Selected</h2>
            <p className="text-text-muted mb-6 max-w-md">Initialize a project to start tracking bugs and managing workflows.</p>
            <button onClick={() => setProjectModalOpen(true)} className="px-6 py-3 bg-surface border border-primary text-primary font-mono rounded hover:bg-primary hover:text-background transition-all shadow-glow">
              Initialize Project
            </button>
          </div>
        )}
      </main>

      <IssueModal
        isOpen={isIssueModalOpen}
        onClose={handleCloseIssueModal}
        issue={selectedIssue}
        users={users}
        onSave={handleSaveIssue}
        onDelete={handleDeleteIssue}
        projectId={selectedProject?.id || ''}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSave={handleSaveProject}
      />
    </div>
  );
}

export default App;