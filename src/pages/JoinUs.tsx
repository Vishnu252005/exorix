import React, { useEffect, useState } from 'react';
import { Briefcase, Send, Loader, PlusCircle, ArrowRight } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db, createJob } from '../firebase';
import CreateJobModal from '../components/CreateJobModal';
import { motion } from 'framer-motion';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const JoinUs = () => {
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const jobsCollection = collection(db, 'jobs');
      const jobsSnapshot = await getDocs(jobsCollection);
      
      const jobsList = jobsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JobOpening[];
      
      setOpenings(jobsList);
      setError(null);
    } catch (err) {
      console.error('Error fetching job openings:', err);
      setError('Failed to load job openings');
      setOpenings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (jobData: any) => {
    try {
      setLoading(true);
      const result = await createJob(jobData);
      if (result.success) {
        setShowCreateJobModal(false);
        fetchJobs();
        alert(result.message || "Job opening created successfully! Thank you for your contribution.");
      } else {
        setError(result.error);
        alert(`Error creating job opening: ${result.error}`);
      }
    } catch (err: any) {
      console.error('Error creating job opening:', err);
      setError(err.message || 'Failed to create job opening');
      alert(`Error creating job opening: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#0A0A0B] to-[#12121A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                Join Our Team
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Be part of a creative team that's shaping the future of digital media.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateJobModal(true)}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Post a Job Opening
            </motion.button>
          </div>
        </div>
      </div>

      {/* Current Openings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Current Openings</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateJobModal(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Post a Job
          </motion.button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-10 h-10 animate-spin text-indigo-600" />
            <span className="ml-4 text-lg text-gray-300">Loading job openings...</span>
          </div>
        ) : openings.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {openings.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50 p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-400 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-indigo-400 mb-4">{job.department}</p>
                  </div>
                  <Briefcase className="w-6 h-6 text-indigo-400" />
                </div>
                <p className="text-gray-300 mb-4">{job.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700/50 text-gray-300">
                      {job.location}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700/50 text-gray-300">
                      {job.type}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No job openings available</h3>
            <p className="text-gray-400 mb-6">
              There are currently no job openings. Be the first to post a job opportunity!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateJobModal(true)}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Post a Job Opening
            </motion.button>
          </div>
        )}
      </div>

      {/* General Application */}
      <div className="bg-gray-800/30 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6 text-white">General Application</h2>
            <p className="text-gray-300 mb-8">
              Don't see a position that matches your skills? Submit a general application and we'll keep your information on file for future opportunities.
            </p>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="portfolio" className="block text-sm font-medium text-gray-300 mb-2">
                  Portfolio URL
                </label>
                <input
                  id="portfolio"
                  type="url"
                  placeholder="Enter your portfolio URL"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Letter
                </label>
                <textarea
                  id="coverLetter"
                  rows={4}
                  placeholder="Write your cover letter here"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                ></textarea>
              </div>
              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-300 mb-2">
                  Resume
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                  <Send className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-300">
                    Drag and drop your resume here, or click to select a file
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Submit Application
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Create Job Modal */}
      <CreateJobModal
        isOpen={showCreateJobModal}
        onClose={() => setShowCreateJobModal(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
};

export default JoinUs;