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

  const statusColorMap: Record<Status, string> = {
    [Status.TODO]: 'bg-blue-200 text-blue-800',
    [Status.IN_PROGRESS]: 'bg-yellow-200 text-yellow-800',
    [Status.DONE]: 'bg-green-200 text-green-800',
  };

  return (
    <div
      onDrop={(e) => onDrop(e, status)}
      onDragOver={onDragOver}
      className="bg-neutral-light rounded-xl w-full md:w-1/3 lg:w-1/4 flex-shrink-0 p-4 flex flex-col"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-neutral-darkest">{status}</h2>
        <span className={`${statusColorMap[status]} rounded-full px-3 py-1 text-sm font-semibold`}>
          {issues.length}
        </span>
      </div>
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            assignee={users.find(u => u.id === issue.assigneeId)}
            onSelectIssue={onSelectIssue}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;