import React from 'react';
import { Priority } from '../types';

interface PriorityIconProps {
  priority: Priority;
  className?: string;
}

const PriorityIcon: React.FC<PriorityIconProps> = ({ priority, className = 'w-4 h-4' }) => {
  const iconMap: Record<Priority, React.ReactNode> = {
    [Priority.LOW]: (
      <svg className={`${className} text-gray-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    [Priority.MEDIUM]: (
      <svg className={`${className} text-primary`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    [Priority.HIGH]: (
      <svg className={`${className} text-orange-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ),
    [Priority.URGENT]: (
      <svg className={`${className} text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
  };

  return <span title={priority}>{iconMap[priority]}</span>;
};

export default PriorityIcon;