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
    <div className="bg-neutral-lightest min-h-screen font-sans text-neutral-darkest">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-brand-primary">Bug Tracker</h1>
            <select 
              value={selectedProject?.id || ''} 
              onChange={(e) => setSelectedProject(projects.find(p => p.id === e.target.value) || null)}
              className="border-neutral-medium rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
            >
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button onClick={() => setProjectModalOpen(true)} className="text-sm text-brand-primary font-semibold hover:underline">
              New Project
            </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-sm">{currentUser.name}</p>
            <button onClick={handleLogout} className="text-xs text-neutral-dark hover:underline">Logout</button>
          </div>
          <button onClick={() => { setSelectedIssue(null); setIssueModalOpen(true); }} className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors">
            + New Issue
          </button>
        </div>
      </header>

      <main className="p-4 md:p-6 lg:p-8">
        {selectedProject ? (
          <div className="flex flex-col md:flex-row gap-6">
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
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold mb-2">No project selected</h2>
            <p className="text-neutral-dark mb-4">Please select a project from the dropdown or create a new one.</p>
            <button onClick={() => setProjectModalOpen(true)} className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors">
              Create a Project
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