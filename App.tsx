import React, { useState, useEffect } from 'react';
import { Project, Bug, User, Status } from './types';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { login, register, logout, getProfile } from './store/slices/authSlice';
import { fetchProjects, createProject, selectProject } from './store/slices/projectsSlice';
import { fetchBugsByProject, createBug, updateBug, deleteBug } from './store/slices/bugsSlice';
import { fetchUsersByProject } from './store/slices/usersSlice';
import Column from './components/Column';
import IssueModal from './components/IssueModal';
import ProjectModal from './components/ProjectModal';
import AuthPage from './components/AuthPage';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user: currentUser, isLoading: authLoading, error: authError } = useAppSelector(state => state.auth);
  const { projects, selectedProject, isLoading: projectsLoading, error: projectsError } = useAppSelector(state => state.projects);
  const { bugs, isLoading: bugsLoading, error: bugsError } = useAppSelector(state => state.bugs);
  const { users } = useAppSelector(state => state.users);

  const [isIssueModalOpen, setIssueModalOpen] = useState(false);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

  // Load initial data
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchProjects());
    }
  }, [currentUser, dispatch]);

  // Load bugs and users when project is selected
  useEffect(() => {
    if (selectedProject) {
      dispatch(fetchBugsByProject(selectedProject.ProjectID));
      dispatch(fetchUsersByProject(selectedProject.ProjectID));
    }
  }, [selectedProject, dispatch]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignup = async (username: string, email: string, password: string) => {
    try {
      await dispatch(register({ Username: username, Email: email, Password: password })).unwrap();
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSelectBug = (bug: Bug) => {
    setSelectedBug(bug);
    setIssueModalOpen(true);
  };

  const handleCloseIssueModal = () => {
    setIssueModalOpen(false);
    setSelectedBug(null);
  };

  const handleSaveBug = async (bugToSave: Bug) => {
    try {
      if (selectedBug) {
        await dispatch(updateBug({
          id: selectedBug.BugID,
          bug: {
            Title: bugToSave.Title,
            Description: bugToSave.Description,
            Status: bugToSave.Status,
            Priority: bugToSave.Priority,
            AssignedTo: bugToSave.AssignedTo,
          }
        })).unwrap();
      } else {
        await dispatch(createBug({
          Title: bugToSave.Title,
          Description: bugToSave.Description,
          Status: bugToSave.Status || 'Open',
          Priority: bugToSave.Priority || 'Medium',
          ProjectID: selectedProject!.ProjectID,
          ReportedBy: currentUser!.UserID,
          AssignedTo: bugToSave.AssignedTo,
        })).unwrap();
      }
      handleCloseIssueModal();
    } catch (error) {
      console.error('Save bug failed:', error);
    }
  };

  const handleDeleteBug = async (bugId: number) => {
    try {
      await dispatch(deleteBug(bugId)).unwrap();
      handleCloseIssueModal();
    } catch (error) {
      console.error('Delete bug failed:', error);
    }
  };

  const handleSaveProject = async (projectToSave: Project) => {
    try {
      await dispatch(createProject({
        ProjectName: projectToSave.ProjectName,
        Description: projectToSave.Description,
        CreatedBy: currentUser!.UserID,
      })).unwrap();
      setProjectModalOpen(false);
    } catch (error) {
      console.error('Create project failed:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, bugId: number) => {
    e.dataTransfer.setData("bugId", bugId.toString());
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, status: string) => {
    const bugId = parseInt(e.dataTransfer.getData("bugId"));
    try {
      await dispatch(updateBug({
        id: bugId,
        bug: { Status: status }
      })).unwrap();
    } catch (error) {
      console.error('Update bug status failed:', error);
    }
  };

  const filteredBugs = selectedProject
    ? bugs.filter(bug => bug.ProjectID === selectedProject.ProjectID)
    : [];

  const bugsByStatus = {
    [Status.OPEN]: filteredBugs.filter(b => b.Status === Status.OPEN),
    [Status.IN_PROGRESS]: filteredBugs.filter(b => b.Status === Status.IN_PROGRESS),
    [Status.RESOLVED]: filteredBugs.filter(b => b.Status === Status.RESOLVED),
  };

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} onSignup={handleSignup} isLoading={authLoading} />;
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
                value={selectedProject?.ProjectID || ''}
                onChange={(e) => dispatch(selectProject(projects.find(p => p.ProjectID === parseInt(e.target.value)) || null))}
                className="bg-transparent border-none text-sm font-semibold focus:ring-0 text-text-main cursor-pointer outline-none min-w-[150px]"
                >
                {projects.map(p => <option key={p.ProjectID} value={p.ProjectID} className="bg-surface">{p.ProjectName}</option>)}
                </select>
            </div>

            <button onClick={() => setProjectModalOpen(true)} className="text-xs font-mono text-primary hover:text-accent transition-colors border border-primary/30 hover:border-accent/50 rounded px-2 py-1">
              + NEW_PROJECT
            </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="font-mono text-xs text-primary">{currentUser.Username}</p>
            <button onClick={handleLogout} className="text-xs text-text-muted hover:text-white transition-colors">Disconnect</button>
          </div>
          <button
            onClick={() => { setSelectedBug(null); setIssueModalOpen(true); }}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-background font-bold rounded-md shadow-glow transition-all duration-200 flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Issue
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-x-auto">
        {(projectsError || bugsError) && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-500/50 text-red-200 text-sm font-mono rounded">
            Error: {projectsError || bugsError}
          </div>
        )}
        {selectedProject ? (
          <div className="flex flex-col md:flex-row gap-6 min-w-full md:min-w-0 h-full">
            {Object.values(Status).map(status => (
              <Column
                key={status}
                status={status}
                issues={bugsByStatus[status]}
                users={[]} // TODO: fetch users
                onSelectIssue={handleSelectBug}
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
        issue={selectedBug}
        users={users}
        onSave={handleSaveBug}
        onDelete={handleDeleteBug}
        projectId={selectedProject?.ProjectID.toString() || ''}
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