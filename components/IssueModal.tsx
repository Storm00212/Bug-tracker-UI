import React, { useState, useEffect, useCallback } from 'react';
import { Issue, User, Status, Priority } from '../types';
import { PRIORITIES } from '../constants';
import { generateIssueDescription } from '../services/geminiService';

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
  const [isGenerating, setIsGenerating] = useState(false);

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
  
  const handleGenerateDescription = useCallback(async () => {
    if (!editableIssue.title) {
        alert("Please enter a title first to generate a description.");
        return;
    }
    setIsGenerating(true);
    try {
        const description = await generateIssueDescription(editableIssue.title);
        setEditableIssue(prev => ({ ...prev, description }));
    } catch (error) {
        console.error("Failed to generate description:", error);
    } finally {
        setIsGenerating(false);
    }
  }, [editableIssue.title]);

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
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-neutral-dark">Description</label>
                <button 
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                  className="flex items-center text-sm text-brand-primary font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                            Generate with AI
                        </>
                    )}
                </button>
            </div>
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
