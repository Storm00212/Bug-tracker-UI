import React, { useEffect, useState } from 'react';
import { Bug, Project, User } from '../types';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectProject } from '../store/slices/projectsSlice';
import { bugsAPI, projectsAPI, usersAPI } from '../services/apiService';
import PriorityIcon from './PriorityIcon';
import UserAvatar from './UserAvatar';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector(state => state.auth);
  const { projects } = useAppSelector(state => state.projects);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [assignedBugs, setAssignedBugs] = useState<Bug[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [showIssuesTooltip, setShowIssuesTooltip] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;

      try {
        setIsLoading(true);
        const [projectsRes, bugsRes, usersRes] = await Promise.all([
          projectsAPI.getByCreator(currentUser.UserID),
          bugsAPI.getByAssignee(currentUser.UserID),
          usersAPI.getAll()
        ]);

        setUserProjects(projectsRes);
        setAssignedBugs(bugsRes);
        setAllUsers(usersRes);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  const getAssignee = (bug: Bug) => {
    return allUsers.find(u => u.UserID === bug.AssignedTo);
  };

  const getReporter = (bug: Bug) => {
    return allUsers.find(u => u.UserID === bug.ReportedBy);
  };

  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.ProjectID === projectId);
    return project ? project.ProjectName : `Project #${projectId}`;
  };

  const handleProjectSelect = (projectId: number) => {
    const project = projects.find(p => p.ProjectID === projectId);
    if (project) {
      dispatch(selectProject(project));
    }
  };

  const filteredBugs = assignedBugs.filter(bug => {
    if (filter === 'open') return bug.Status === 'Open';
    if (filter === 'closed') return bug.Status === 'Resolved';
    return true;
  });

  const recentBugs = filteredBugs
    .sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
    .slice(0, 8);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-text-muted">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold font-mono text-text-main mb-2">
          Welcome back, <span className="text-primary">{currentUser?.Username}</span>
        </h1>
        <p className="text-text-muted">Here's an overview of your work</p>
      </div>

      {/* Metrics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-highlight border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-200" data-cy="active-projects-metric">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm font-mono uppercase tracking-wider">Active Projects</p>
              <p className="text-3xl font-bold text-primary mt-2" data-cy="active-projects-count">{userProjects.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-surface-highlight border border-border rounded-lg p-6 hover:border-accent/50 transition-all duration-200 relative" data-cy="assigned-issues-metric">
          <div className="flex items-center justify-between">
            <div
              className="cursor-help"
              onMouseEnter={() => setShowIssuesTooltip(true)}
              onMouseLeave={() => setShowIssuesTooltip(false)}
              data-cy="assigned-issues-hover-area"
            >
              <p className="text-text-muted text-sm font-mono uppercase tracking-wider">Assigned Issues</p>
              <p className="text-3xl font-bold text-accent mt-2" data-cy="assigned-issues-count">{assignedBugs.length}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          {/* Issues Tooltip */}
          {showIssuesTooltip && assignedBugs.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto" data-cy="issues-tooltip">
              <div className="p-3 border-b border-border">
                <h4 className="text-sm font-bold text-text-main font-mono">Your Assigned Issues</h4>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {assignedBugs.slice(0, 10).map((bug) => (
                  <div key={bug.BugID} className="p-3 border-b border-border/50 last:border-b-0 hover:bg-surface-highlight/50" data-cy="tooltip-issue">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-sm font-medium text-text-main line-clamp-1">{bug.Title}</h5>
                      <span className={`text-[10px] font-mono px-2 py-1 rounded border ml-2 ${
                        bug.Status === 'Open' ? 'text-green-400 border-green-400/50 bg-green-400/10' :
                        bug.Status === 'In Progress' ? 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10' :
                        'text-gray-400 border-gray-400/50 bg-gray-400/10'
                      }`}>
                        {bug.Status}
                      </span>
                    </div>
                    {bug.Description && (
                      <p className="text-xs text-text-muted mb-2 line-clamp-2">{bug.Description}</p>
                    )}
                    <div className="flex justify-between items-center text-xs text-text-muted">
                      <span className="font-mono">#{bug.BugID}</span>
                      <span className="font-medium">{getProjectName(bug.ProjectID)}</span>
                    </div>
                  </div>
                ))}
                {assignedBugs.length > 10 && (
                  <div className="p-3 text-center text-xs text-text-muted border-t border-border">
                    And {assignedBugs.length - 10} more issues...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface-highlight border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-mono text-text-main">Recent Activity</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              data-cy="filter-all"
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                filter === 'all'
                  ? 'text-background bg-primary border border-primary'
                  : 'text-primary border border-primary/30 hover:bg-primary hover:text-background'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('open')}
              data-cy="filter-open"
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                filter === 'open'
                  ? 'text-background bg-green-500 border border-green-500'
                  : 'text-text-muted border border-border hover:border-green-500/50'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setFilter('closed')}
              data-cy="filter-closed"
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                filter === 'closed'
                  ? 'text-background bg-gray-500 border border-gray-500'
                  : 'text-text-muted border border-border hover:border-gray-500/50'
              }`}
            >
              Closed
            </button>
          </div>
        </div>

        {recentBugs.length === 0 ? (
          <div className="text-center py-8 text-text-muted">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No recent issues found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentBugs.map((bug) => (
              <div
                key={bug.BugID}
                onClick={() => handleProjectSelect(bug.ProjectID)}
                data-cy="issue-card"
                className="bg-surface border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-glow transition-all duration-200 cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono text-text-muted bg-background px-2 py-1 rounded border border-border" data-cy="issue-id">
                    #{bug.BugID}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-1 rounded border ${
                      bug.Status === 'Open' ? 'text-green-400 border-green-400/50 bg-green-400/10' :
                      bug.Status === 'In Progress' ? 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10' :
                      'text-gray-400 border-gray-400/50 bg-gray-400/10'
                    }`}>
                      {bug.Status}
                    </span>
                    <PriorityIcon priority={bug.Priority} />
                  </div>
                </div>

                <h3 className="font-medium text-text-main text-sm mb-3 line-clamp-2 group-hover:text-primary transition-colors" data-cy="issue-title">
                  {bug.Title}
                </h3>

                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Project</span>
                    <span className="text-xs text-text-muted font-mono">#{bug.ProjectID}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserAvatar user={getAssignee(bug)} size="sm" />
                    <div className="text-right">
                      <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Updated</span>
                      <span className="text-xs text-text-muted font-mono block">
                        {new Date(bug.CreatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;