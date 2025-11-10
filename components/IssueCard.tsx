import React from 'react';
import { Issue, User } from '../types';
import PriorityIcon from './PriorityIcon';
import UserAvatar from './UserAvatar';

interface IssueCardProps {
  issue: Issue;
  assignee: User | undefined;
  onSelectIssue: (issue: Issue) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, issueId: string) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, assignee, onSelectIssue, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, issue.id)}
      onClick={() => onSelectIssue(issue)}
      className="bg-white rounded-lg p-3.5 mb-3 shadow-sm hover:shadow-md cursor-pointer transition-shadow duration-200 border border-neutral-medium/50"
    >
      <p className="font-medium text-neutral-darkest mb-2">{issue.title}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <PriorityIcon priority={issue.priority} />
          <span className="text-xs text-neutral-dark font-semibold">{issue.id.split('-')[0]}</span>
        </div>
        <UserAvatar user={assignee} size="sm" />
      </div>
    </div>
  );
};

export default IssueCard;