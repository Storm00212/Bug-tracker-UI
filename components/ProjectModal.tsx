import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      alert('Project name is required.');
      return;
    }
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name,
      description,
    };
    onSave(newProject);
    setName('');
    setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-darkest">Create New Project</h2>
          <button onClick={onClose} className="text-neutral-medium hover:text-neutral-darkest transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-neutral-medium rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
              placeholder="e.g., Q4 Marketing Campaign"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border-neutral-medium rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
              placeholder="A brief summary of what this project is about."
            ></textarea>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-neutral-light text-neutral-darkest font-semibold rounded-md hover:bg-neutral-medium transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors">
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
