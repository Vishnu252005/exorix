import React, { useState } from 'react';
import { X } from 'lucide-react';

interface JobData {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: JobData) => Promise<void>;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [jobData, setJobData] = useState<JobData>({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(jobData);
      // Reset form after successful submission
      setJobData({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        description: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create job opening');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Create Job Opening</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Department*
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={jobData.department}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location*
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                required
                placeholder="e.g., San Francisco, CA, Remote, Hybrid"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Type*
              </label>
              <select
                id="type"
                name="type"
                value={jobData.type}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={jobData.description}
                onChange={handleChange}
                required
                rows={4}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJobModal; 