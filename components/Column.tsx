import React from 'react';
import { Status, Issue, User } from '../types';
import IssueCard from './IssueCard';

interface ColumnProps {
  status: Status;
  issues: Issue[];
  users: User[];
  onSelectIssue: (issue: Issue) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, issueId: string) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: Status) => void;
}

const Column: React.FC<ColumnProps> = ({ status, issues, users, onSelectIssue, onDragStart, onDrop }) => {
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const statusColors: Record<Status, string> = {
    [Status.TODO]: 'bg-gray-700 text-gray-300 border-gray-600',
    [Status.IN_PROGRESS]: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50',
    [Status.DONE]: 'bg-green-900/30 text-accent border-accent/30',
  };

  const statusIndicator: Record<Status, string> = {
    [Status.TODO]: 'bg-gray-500',
    [Status.IN_PROGRESS]: 'bg-yellow-500',
    [Status.DONE]: 'bg-accent',
  };

  return (
    <div
      onDrop={(e) => onDrop(e, status)}
      onDragOver={onDragOver}
      className="bg-surface rounded-xl border border-border w-full md:w-1/3 lg:w-1/4 flex-shrink-0 flex flex-col h-full max-h-full"
    >
      <div className="p-4 border-b border-border flex justify-between items-center bg-surface-highlight/50 rounded-t-xl backdrop-blur-sm">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusIndicator[status]} shadow-[0_0_8px_currentColor]`}></div>
            <h2 className="font-mono font-bold text-sm tracking-wider uppercase text-text-main">{status}</h2>
        </div>
        <span className="bg-background text-text-muted border border-border rounded px-2 py-0.5 text-xs font-mono">
          {issues.length}
        </span>
      </div>
      
      <div className="flex-grow overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            assignee={users.find(u => u.id === issue.assigneeId)}
            onSelectIssue={onSelectIssue}
            onDragStart={onDragStart}
          />
        ))}
        {issues.length === 0 && (
            <div className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-text-muted text-xs font-mono opacity-50">
                NO ISSUES
            </div>
        )}
      </div>
    </div>
  );
};

export default Column;