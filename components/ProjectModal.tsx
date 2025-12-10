import React, { useState } from 'react';
import { Project } from '../types';
import toast from 'react-hot-toast';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: { ProjectName: string; Description?: string }) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Project name is required', { duration: 4000 });
      console.error('Project creation validation error: Project name is required');
      return;
    }
    try {
      await onSave({
        ProjectName: name,
        Description: description || undefined,
      });
      toast.success('Project created successfully!', { duration: 2000 });
      setName('');
      setDescription('');
    } catch (error) {
      toast.error('Failed to create project', { duration: 4000 });
      console.error('Project creation failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div data-cy="project-modal" className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl shadow-2xl p-0 w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-border bg-surface-highlight flex justify-between items-center">
            <h2 className="text-xl font-bold font-mono text-primary">{'>'} INIT_PROJECT</h2>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-8 space-y-6 bg-surface">
          <div>
            <label className="block text-xs font-mono font-bold text-primary mb-2 uppercase tracking-wider">Project Name</label>
            <input
              data-cy="project-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border border-border rounded p-3 text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-600"
              placeholder="e.g., Q4_Marketing_Campaign"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-primary mb-2 uppercase tracking-wider">Description</label>
            <textarea
              data-cy="project-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-background border border-border rounded p-3 text-text-main font-mono text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-600"
              placeholder="Brief summary..."
            ></textarea>
          </div>
        </div>
        
        <div className="p-6 border-t border-border bg-surface-highlight flex justify-end gap-4">
          <button data-cy="project-cancel-button" onClick={onClose} className="px-4 py-2 text-text-muted hover:text-white transition-colors font-mono text-sm">
            CANCEL
          </button>
          <button data-cy="project-submit-button" onClick={handleSave} className="px-6 py-2 bg-primary hover:bg-primary-dark text-background font-bold rounded shadow-glow transition-all font-mono text-sm">
            CREATE_PROJECT
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;