import React, { useEffect, useState } from 'react';
import { Project, Bug, User } from '../types';
import { useAppSelector } from '../store/hooks';
import { projectsAPI, bugsAPI, usersAPI } from '../services/apiService';

interface ProjectMetrics {
  project: Project;
  totalIssues: number;
  resolvedIssues: number;
  resolutionRate: number;
  userCount: number;
  users: User[];
  issuesByStatus: { [key: string]: number };
}

const AdminDashboard: React.FC = () => {
  const { user: currentUser } = useAppSelector(state => state.auth);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allBugs, setAllBugs] = useState<Bug[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [projectMetrics, setProjectMetrics] = useState<ProjectMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [selectedProject, setSelectedProject] = useState<ProjectMetrics | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!currentUser) return;

      try {
        setIsLoading(true);
        const [projectsRes, bugsRes, usersRes] = await Promise.all([
          projectsAPI.getAll(),
          bugsAPI.getAll(),
          usersAPI.getAll()
        ]);

        setAllProjects(projectsRes);
        setAllBugs(bugsRes);
        setAllUsers(usersRes);

        // Calculate metrics for each project
        const metrics = projectsRes.map(project => {
          const projectBugs = bugsRes.filter(bug => bug.ProjectID === project.ProjectID);
          const projectUsers = usersRes.filter(user =>
            projectBugs.some(bug => bug.AssignedTo === user.UserID) ||
            projectBugs.some(bug => bug.ReportedBy === user.UserID) ||
            project.CreatedBy === user.UserID
          );

          const totalIssues = projectBugs.length;
          const resolvedIssues = projectBugs.filter(bug => bug.Status === 'Resolved').length;
          const resolutionRate = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0;

          const issuesByStatus = projectBugs.reduce((acc, bug) => {
            acc[bug.Status] = (acc[bug.Status] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number });

          return {
            project,
            totalIssues,
            resolvedIssues,
            resolutionRate,
            userCount: projectUsers.length,
            users: projectUsers,
            issuesByStatus
          };
        });

        setProjectMetrics(metrics);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [currentUser]);

  // Calculate overall metrics
  const totalProjects = allProjects.length;
  const totalIssues = allBugs.length;
  const totalResolvedIssues = allBugs.filter(bug => bug.Status === 'Resolved').length;
  const overallResolutionRate = totalIssues > 0 ? (totalResolvedIssues / totalIssues) * 100 : 0;

  // Filter and sort projects
  const filteredProjects = projectMetrics.filter(metrics => {
    if (filter === 'active') {
      return metrics.totalIssues > 0;
    }
    return true;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.project.CreatedAt).getTime() - new Date(a.project.CreatedAt).getTime();
    } else {
      return a.project.ProjectName.localeCompare(b.project.ProjectName);
    }
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-text-muted">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold font-mono text-text-main mb-2">
          Admin Dashboard
        </h1>
        <p className="text-text-muted">System-wide project and issue analytics</p>
      </div>

      {/* Overall Metrics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-highlight border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm font-mono uppercase tracking-wider">Total Projects</p>
              <p className="text-3xl font-bold text-primary mt-2">{totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-surface-highlight border border-border rounded-lg p-6 hover:border-accent/50 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm font-mono uppercase tracking-wider">Total Issues</p>
              <p className="text-3xl font-bold text-accent mt-2">{totalIssues}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-surface-highlight border border-border rounded-lg p-6 hover:border-secondary/50 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm font-mono uppercase tracking-wider">Resolution Rate</p>
              <p className="text-3xl font-bold text-secondary mt-2">{overallResolutionRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-surface-highlight border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-mono text-text-main">Project Analytics</h2>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  filter === 'all'
                    ? 'text-background bg-primary border border-primary'
                    : 'text-primary border border-primary/30 hover:bg-primary hover:text-background'
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  filter === 'active'
                    ? 'text-background bg-green-500 border border-green-500'
                    : 'text-text-muted border border-border hover:border-green-500/50'
                }`}
              >
                Active Only
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('date')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  sortBy === 'date'
                    ? 'text-background bg-secondary border border-secondary'
                    : 'text-text-muted border border-border hover:border-secondary/50'
                }`}
              >
                By Date
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  sortBy === 'name'
                    ? 'text-background bg-secondary border border-secondary'
                    : 'text-text-muted border border-border hover:border-secondary/50'
                }`}
              >
                By Name
              </button>
            </div>
          </div>
        </div>

        {sortedProjects.length === 0 ? (
          <div className="text-center py-8 text-text-muted">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p>No projects found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProjects.map((metrics) => (
              <div
                key={metrics.project.ProjectID}
                onClick={() => setSelectedProject(selectedProject?.project.ProjectID === metrics.project.ProjectID ? null : metrics)}
                className="bg-surface border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-glow transition-all duration-200 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-text-main text-lg mb-1">{metrics.project.ProjectName}</h3>
                    <p className="text-text-muted text-sm font-mono">
                      Created: {new Date(metrics.project.CreatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {metrics.resolutionRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-text-muted font-mono uppercase tracking-wider">
                      Resolution Rate
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-accent">{metrics.totalIssues}</div>
                    <div className="text-xs text-text-muted font-mono uppercase tracking-wider">Total Issues</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-400">{metrics.resolvedIssues}</div>
                    <div className="text-xs text-text-muted font-mono uppercase tracking-wider">Resolved</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-secondary">{metrics.userCount}</div>
                    <div className="text-xs text-text-muted font-mono uppercase tracking-wider">Users</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-text-main">
                      {Object.keys(metrics.issuesByStatus).length}
                    </div>
                    <div className="text-xs text-text-muted font-mono uppercase tracking-wider">Status Types</div>
                  </div>
                </div>

                {selectedProject?.project.ProjectID === metrics.project.ProjectID && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Users List */}
                      <div>
                        <h4 className="font-bold text-text-main mb-3 font-mono">Users Involved</h4>
                        <div className="space-y-2">
                          {metrics.users.map((user) => (
                            <div key={user.UserID} className="flex items-center gap-3 p-2 bg-background rounded">
                              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                                {user.Username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-text-main">{user.Username}</div>
                                <div className="text-xs text-text-muted">{user.Role}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Issues Breakdown */}
                      <div>
                        <h4 className="font-bold text-text-main mb-3 font-mono">Issues by Status</h4>
                        <div className="space-y-3">
                          {Object.entries(metrics.issuesByStatus).map(([status, count]) => (
                            <div key={status} className="flex justify-between items-center">
                              <span className="text-sm text-text-main">{status}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-border rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${metrics.totalIssues > 0 ? (Number(count) / metrics.totalIssues) * 100 : 0}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-mono text-text-muted w-8 text-right">{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;