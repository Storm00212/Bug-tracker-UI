import React, { useState, useEffect } from 'react';
import { Bug, User, Status, Priority } from '../types';
import { PRIORITIES } from '../constants';
import toast from 'react-hot-toast';

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Bug | null;
  users: User[];
  onSave: (bug: Bug) => void;
  onDelete: (bugId: number) => void;
  projectId: string;
}

const IssueModal: React.FC<IssueModalProps> = ({ isOpen, onClose, issue, users, onSave, onDelete, projectId }) => {
  const [editableBug, setEditableBug] = useState<Partial<Bug>>({});

  useEffect(() => {
    if (issue) {
      setEditableBug({ ...issue });
    } else {
      setEditableBug({
        BugID: 0, // Will be set by backend
        Title: '',
        Description: '',
        Status: Status.OPEN,
        Priority: Priority.MEDIUM,
        AssignedTo: null,
        ProjectID: parseInt(projectId),
        ReportedBy: null,
        CreatedAt: new Date().toISOString(),
      });
    }
  }, [issue, isOpen, projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableBug(prev => ({ ...prev, [name]: value }));
  };


  const handleSave = async () => {
    if (!editableBug.Title?.trim()) {
      toast.error('Issue title is required', { duration: 4000 });
      console.error('Issue creation/edit validation error: Title is required');
      return;
    }
    try {
      await onSave(editableBug as Bug);
      toast.success(issue ? 'Issue updated successfully!' : 'Issue created successfully!', { duration: 2000 });
    } catch (error) {
      toast.error('Failed to save issue', { duration: 4000 });
      console.error('Issue save failed:', error);
    }
  };

  const handleDelete = async () => {
    if (issue) {
      try {
        await onDelete(issue.BugID);
        toast.success('Issue deleted successfully!', { duration: 2000 });
      } catch (error) {
        toast.error('Failed to delete issue', { duration: 4000 });
        console.error('Issue delete failed:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl shadow-2xl p-0 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-border flex justify-between items-center bg-surface-highlight">
          <div>
             <h2 className="text-xl font-bold font-mono text-primary flex items-center gap-2">
                {issue ? '> EDIT_ISSUE' : '> NEW_ISSUE'}
                <span className="animate-pulse inline-block w-2 h-4 bg-primary align-middle"></span>
             </h2>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-grow bg-surface">
          <div>
            <label className="block text-xs font-mono font-bold text-primary mb-2 uppercase tracking-wider">Title</label>
            <input
                type="text"
                name="Title"
                value={editableBug.Title || ''}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded p-3 text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-600"
                placeholder="Brief summary of the bug..."
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-primary mb-2 uppercase tracking-wider">Description</label>
            <textarea
                name="Description"
                value={editableBug.Description || ''}
                onChange={handleChange}
                rows={8}
                className="w-full bg-background border border-border rounded p-3 text-text-main font-mono text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-600"
                placeholder="Steps to reproduce, expected behavior, logs..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div>
             <label className="block text-xs font-mono font-bold text-primary mb-2 uppercase tracking-wider">Status</label>
             <select name="Status" value={editableBug.Status || ''} onChange={handleChange} className="w-full bg-background border border-border rounded p-2.5 text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer">
               {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
             </select>
           </div>
           <div>
             <label className="block text-xs font-mono font-bold text-primary mb-2 uppercase tracking-wider">Assignee</label>
             <select name="AssignedTo" value={editableBug.AssignedTo || ''} onChange={(e) => setEditableBug(prev => ({ ...prev, AssignedTo: e.target.value ? parseInt(e.target.value) : null }))} className="w-full bg-background border border-border rounded p-2.5 text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer">
               <option value="">-- Unassigned --</option>
               {users.map(u => <option key={u.UserID} value={u.UserID}>{u.Username}</option>)}
             </select>
           </div>
           <div>
             <label className="block text-xs font-mono font-bold text-primary mb-2 uppercase tracking-wider">Priority</label>
             <select name="Priority" value={editableBug.Priority || ''} onChange={handleChange} className="w-full bg-background border border-border rounded p-2.5 text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer">
               {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
             </select>
           </div>
         </div>
        </div>

        <div className="p-6 border-t border-border bg-surface-highlight flex justify-between items-center">
          <div>
            {issue && (
              <button onClick={handleDelete} className="text-red-500 hover:text-red-400 text-sm font-mono flex items-center gap-1 transition-colors">
                [DELETE]
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-4 py-2 text-text-muted hover:text-white transition-colors font-mono text-sm">
              CANCEL
            </button>
            <button onClick={handleSave} className="px-6 py-2 bg-primary hover:bg-primary-dark text-background font-bold rounded shadow-glow transition-all font-mono text-sm">
              {issue ? 'SAVE_CHANGES' : 'CREATE_ISSUE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;