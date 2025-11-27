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
      className="group bg-surface-highlight hover:bg-[#252b3b] border border-border hover:border-primary/50 rounded-lg p-4 shadow-sm hover:shadow-glow transition-all duration-200 cursor-grab active:cursor-grabbing relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary transition-colors"></div>
      
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-mono text-text-muted bg-background px-1.5 py-0.5 rounded border border-border">
          {issue.id}
        </span>
        <PriorityIcon priority={issue.priority} />
      </div>
      
      <p className="font-medium text-text-main text-sm mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
        {issue.title}
      </p>
      
      <div className="flex justify-between items-end border-t border-border pt-3 mt-1">
        <div className="flex flex-col">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Project</span>
            <span className="text-xs text-text-muted font-mono">{issue.projectId.split('-')[1]}</span>
        </div>
        <UserAvatar user={assignee} size="sm" />
      </div>
    </div>
  );
};

export default IssueCard;