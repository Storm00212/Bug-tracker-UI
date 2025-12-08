
import React from 'react';
import { User } from '../types';

interface UserAvatarProps {
  user: User | undefined | null;
  size?: 'sm' | 'md';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
  };

  if (!user) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-neutral-medium flex items-center justify-center text-white font-bold ring-2 ring-white`} title="Unassigned">
        ?
      </div>
    );
  }

  const initials = user.Username.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const avatarUrl = user.avatar || `https://i.pravatar.cc/150?u=${user.UserID}`;

  return (
    <img
      src={avatarUrl}
      alt={user.Username}
      title={user.Username}
      className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        // Fallback to a div with initials if the image fails to load
        const parent = target.parentNode;
        if(parent) {
            const fallback = document.createElement('div');
            fallback.className = `${sizeClasses[size]} rounded-full bg-brand-primary flex items-center justify-center text-white font-bold ring-2 ring-white`;
            fallback.title = user.Username;
            fallback.innerText = initials;
            parent.replaceChild(fallback, target);
        }
      }}
    />
  );
};

export default UserAvatar;
