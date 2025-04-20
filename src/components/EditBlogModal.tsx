import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface EditBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (blogData: {
    title: string;
    content: string;
    summary: string;
    category: string;
    tags: string[];
    coverImage: string;
    status: 'draft' | 'published';
  }) => void;
  blogData: {
    id: string;
    title: string;
    content: string;
    summary: string;
    category: string;
    tags: string[];
    coverImage: string;
    status: 'draft' | 'published';
    createdAt: Timestamp;
  } | null;
}

const EditBlogModal: React.FC<EditBlogModalProps> = ({ isOpen, onClose, onSubmit, blogData }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: '',
    tags: [] as string[],
    coverImage: '',
    status: 'draft' as 'draft' | 'published'
  });

  const [tagInput, setTagInput] = useState('');

  const categories = [
    'Gaming News',
    'Tournament Updates',
    'Game Reviews',
    'Strategy Guides',
    'Esports News',
    'Community Spotlight',
    'Other'
  ];

  useEffect(() => {
    if (blogData) {
      setFormData({
        title: blogData.title || '',
        content: blogData.content || '',
        summary: blogData.summary || '',
        category: blogData.category || '',
        tags: blogData.tags || [],
        coverImage: blogData.coverImage || '',
        status: blogData.status || 'draft'
      });
    }
  }, [blogData]);

  const handleTagAdd = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput]
      });
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl p-6 my-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Blog Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Blog Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Summary
            </label>
            <textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cover Image URL
            </label>
            <input
              type="url"
              id="coverImage"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-indigo-200 text-indigo-500 hover:bg-indigo-300 dark:bg-indigo-800 dark:text-indigo-100 dark:hover:bg-indigo-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="button"
                onClick={handleTagAdd}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:hover:bg-gray-500"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Blog Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogModal; 