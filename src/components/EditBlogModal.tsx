import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RefreshCw } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface Blog {
    id: string;
    title: string;
    content: string;
    summary: string;
    category: string;
    tags: string[];
    coverImage: string;
    status: 'draft' | 'published';
  seoKeywords?: string[];
  structure?: string[];
}

interface EditBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (blogData: Partial<Blog>) => Promise<void>;
  blogData: Blog | null;
}

const EditBlogModal: React.FC<EditBlogModalProps> = ({ isOpen, onClose, onSubmit, blogData }) => {
  const [formData, setFormData] = useState<Partial<Blog>>({
    title: '',
    content: '',
    summary: '',
    category: '',
    tags: [],
    coverImage: '',
    status: 'draft',
    seoKeywords: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [seoInput, setSeoInput] = useState('');

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
      setFormData(blogData);
    }
  }, [blogData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleSeoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && seoInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        seoKeywords: [...(prev.seoKeywords || []), seoInput.trim()]
      }));
      setSeoInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index)
    }));
  };

  const removeSeoKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: prev.seoKeywords?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Edit Blog Post</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                aria-label="Close modal"
          >
                <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm text-gray-400">Title</label>
              <input
                type="text"
                id="title"
                  name="title"
                value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <label htmlFor="summary" className="text-sm text-gray-400">Summary</label>
                <textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm text-gray-400">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={10}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm text-gray-400">Category</label>
              <select
                id="category"
                  name="category"
                value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
          </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label htmlFor="coverImage" className="text-sm text-gray-400">Cover Image URL</label>
            <input
              type="url"
              id="coverImage"
                  name="coverImage"
              value={formData.coverImage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

              {/* Tags */}
              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm text-gray-400">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags?.map((tag, index) => (
                <span
                      key={index}
                      className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                        onClick={() => removeTag(index)}
                        className="ml-2 hover:text-indigo-300"
                        aria-label={`Remove tag ${tag}`}
                  >
                        <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
              <input
                type="text"
                value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Press Enter to add tags"
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* SEO Keywords */}
              <div className="space-y-2">
                <label htmlFor="seoKeywords" className="text-sm text-gray-400">SEO Keywords</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.seoKeywords?.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm flex items-center"
                    >
                      {keyword}
              <button
                type="button"
                        onClick={() => removeSeoKeyword(index)}
                        className="ml-2 hover:text-purple-300"
                        aria-label={`Remove SEO keyword ${keyword}`}
              >
                        <X className="w-3 h-3" />
              </button>
                    </span>
                  ))}
            </div>
                <input
                  type="text"
                  value={seoInput}
                  onChange={e => setSeoInput(e.target.value)}
                  onKeyDown={handleSeoKeyDown}
                  placeholder="Press Enter to add SEO keywords"
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
          </div>

              {/* Status */}
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm text-gray-400">Status</label>
            <select
              id="status"
                  name="status"
              value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
            </button>
          </div>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditBlogModal; 