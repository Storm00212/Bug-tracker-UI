import React, { useState, useEffect } from 'react';
import { Issue, User, Status, Priority } from '../types';
import { PRIORITIES } from '../constants';

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue | null;
  users: User[];
  onSave: (issue: Issue) => void;
  onDelete: (issueId: string) => void;
  projectId: string;
}

const IssueModal: React.FC<IssueModalProps> = ({ isOpen, onClose, issue, users, onSave, onDelete, projectId }) => {
  const [editableIssue, setEditableIssue] = useState<Partial<Issue>>({});

  useEffect(() => {
    if (issue) {
      setEditableIssue({ ...issue });
    } else {
      setEditableIssue({
        id: `issue-${Date.now()}`,
        title: '',
        description: '',
        status: Status.TODO,
        priority: Priority.MEDIUM,
        assigneeId: null,
        projectId: projectId,
      });
    }
  }, [issue, isOpen, projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableIssue(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (editableIssue.title) {
      onSave(editableIssue as Issue);
    }
  };

  const handleDelete = () => {
    if (issue) {
      onDelete(issue.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-darkest">{issue ? 'Edit Issue' : 'Create New Issue'}</h2>
          <button onClick={onClose} className="text-neutral-medium hover:text-neutral-darkest transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">Title</label>
            <input type="text" name="title" value={editableIssue.title || ''} onChange={handleChange} className="w-full border-neutral-medium rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">Description</label>
            <textarea name="description" value={editableIssue.description || ''} onChange={handleChange} rows={6} className="w-full border-neutral-medium rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Status</label>
              <select name="status" value={editableIssue.status || ''} onChange={handleChange} className="w-full border-neutral-medium rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary">
                {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Assignee</label>
              <select name="assigneeId" value={editableIssue.assigneeId || ''} onChange={handleChange} className="w-full border-neutral-medium rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary">
                <option value="">Unassigned</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Priority</label>
              <select name="priority" value={editableIssue.priority || ''} onChange={handleChange} className="w-full border-neutral-medium rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary">
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <div>
            {issue && (
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors">
                Delete Issue
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-4 py-2 bg-neutral-light text-neutral-darkest font-semibold rounded-md hover:bg-neutral-medium transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors">
              {issue ? 'Save Changes' : 'Create Issue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;