import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#0A0A0B] to-[#12121A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                Contact Us
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Get in touch with our team to discuss your next project.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">Send Us a Message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Your phone number"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                Send Message
                <Send className="h-4 w-4" />
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2>
            <div className="space-y-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-start p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
              >
                <Mail className="w-6 h-6 text-indigo-400 mr-4" />
                <div>
                  <h3 className="font-semibold mb-1 text-white">Email</h3>
                  <p className="text-gray-300">contact@exorixstudio.com</p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-start p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
              >
                <Phone className="w-6 h-6 text-indigo-400 mr-4" />
                <div>
                  <h3 className="font-semibold mb-1 text-white">Phone</h3>
                  <p className="text-gray-300">(555) 123-4567</p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-start p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
              >
                <MapPin className="w-6 h-6 text-indigo-400 mr-4" />
                <div>
                  <h3 className="font-semibold mb-1 text-white">Location</h3>
                  <p className="text-gray-300">
                    123 Digital Avenue<br />
                    San Francisco, CA 94105<br />
                    United States
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Map */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-8 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80"
                alt="Office Location Map"
                className="w-full h-64 object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;