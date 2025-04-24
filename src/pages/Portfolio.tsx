import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Trophy, 
  Users, 
  Calendar, 
  Video, 
  Shield,
  Zap,
  Star,
  Sparkles,
  Medal,
  Crown,
  Globe,
  Clock
} from 'lucide-react';

// Add new interfaces for live streams and gaming achievements
interface LiveStream {
  id: string;
  title: string;
  game: string;
  platform: 'Twitch' | 'YouTube';
  status: 'live' | 'upcoming' | 'ended';
  startTime: string;
  viewers?: number;
  thumbnailUrl: string;
  streamUrl: string;
}

interface GamingAchievement {
  id: string;
  title: string;
  game: string;
  description: string;
  date: string;
  icon: string;
}

const Portfolio = () => {
  // State to track which video is currently playing in fullscreen mode
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  // State to track which project card is being hovered
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [activeStream, setActiveStream] = useState<LiveStream | null>(null);

  const projects = [
    {
      title: 'CS2 Major Championship Finals',
      category: 'Esports Tournament',
      description: 'BLAST.tv Paris Major 2023 Grand Finals - Vitality vs GamerLegion',
      youtubeEmbed: 'https://www.youtube.com/embed/t1I93MoKoVo',
      tags: ['CS2', 'Tournament', 'Grand Finals', 'Pro Play']
    },
    {
      title: 'Valorant Champions 2023',
      category: 'Esports Highlights',
      description: 'Evil Geniuses vs Paper Rex - Valorant Champions 2023 Grand Finals Highlights',
      youtubeEmbed: 'https://www.youtube.com/embed/7No6GqMwxAc',
      tags: ['Valorant', 'Champions', 'Highlights', 'Pro Play']
    },
    {
      title: 'League of Legends Worlds 2023',
      category: 'Tournament Coverage',
      description: 'T1 vs WBG - Worlds 2023 Semi-Finals Full Match',
      youtubeEmbed: 'https://www.youtube.com/embed/0zQHxZqMEPE',
      tags: ['LoL', 'Worlds', 'Semi-Finals', 'T1']
    },
    {
      title: 'Dota 2 The International',
      category: 'Championship Finals',
      description: 'Team Spirit vs PSG.LGD - The International 10 Grand Finals',
      youtubeEmbed: 'https://www.youtube.com/embed/ZPCxvHQYdKc',
      tags: ['Dota 2', 'TI10', 'Grand Finals', 'Team Spirit']
    },
    {
      title: 'PUBG Global Championship',
      category: 'Battle Royale',
      description: 'PGC 2023 Grand Finals Highlights - Best Moments',
      youtubeEmbed: 'https://www.youtube.com/embed/p1H3GsAM5Ug',
      tags: ['PUBG', 'Championship', 'Highlights', 'Esports']
    },
    {
      title: 'Rocket League World Championship',
      category: 'Esports Finals',
      description: 'RLCS 2023-24 Winter Major - Grand Finals Highlights',
      youtubeEmbed: 'https://www.youtube.com/embed/KOI5dUhFEzg',
      tags: ['Rocket League', 'RLCS', 'Major', 'Finals']
    }
  ];

  // Featured projects with more details
  const featuredProjects = [
    {
      title: 'Live: ESL Pro League Season 19',
      category: 'Live Tournament Stream',
      description: 'Watch the intense ESL Pro League Season 19 matches live! Experience professional CS2 gameplay at its finest with real-time commentary and analysis.',
      stats: [
        { label: 'Live Viewers', value: 'LIVE' },
        { label: 'Teams', value: '24' },
        { label: 'Prize Pool', value: '$850K' },
      ],
      youtubeEmbed: 'https://www.youtube.com/embed/BdhjFVUu8hA',
      technologies: ['Live Stream', 'HD Quality', 'Live Stats', 'Pro Commentary']
    },
    {
      title: 'VCT LOCK//IN São Paulo',
      category: 'Valorant Championship',
      description: 'Witness the most intense Valorant matches from the VCT LOCK//IN tournament in São Paulo.',
      stats: [
        { label: 'Views', value: '850K' },
        { label: 'Teams', value: '32' },
        { label: 'Maps', value: '54' },
      ],
      youtubeEmbed: 'https://www.youtube.com/embed/nuMUL8Y_Q4c',
      technologies: ['8K Production', 'Player Cams', 'Match Analytics', 'Highlight Reels']
    }
  ];

  // Update the live streams array to include the current stream
  const liveStreams = [
    {
      id: '1',
      title: 'ESL Pro League Season 19 - LIVE',
      game: 'Counter-Strike 2',
      platform: 'YouTube',
      status: 'live',
      startTime: new Date().toISOString(),
      viewers: 45000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
      streamUrl: 'https://www.youtube.com/live/BdhjFVUu8hA?si=0CDGw970lpqv-VIf'
    },
    {
      id: '2',
      title: 'Pro League Qualifiers - Day 2',
      game: 'Valorant',
      platform: 'YouTube',
      status: 'upcoming',
      startTime: new Date(Date.now() + 3600000).toISOString(),
      thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
      streamUrl: 'https://youtube.com/yourchannelname'
    }
  ];

  // Sample achievements data
  const achievements: GamingAchievement[] = [
    {
      id: '1',
      title: 'Tournament Champion',
      game: 'Counter-Strike 2',
      description: 'First place in the Regional Championship 2024',
      date: '2024-02-15',
      icon: '🏆'
    },
    {
      id: '2',
      title: 'MVP Player',
      game: 'Valorant',
      description: 'Most Valuable Player in Pro League Season 5',
      date: '2024-01-20',
      icon: '⭐'
    }
  ];

  // Function to extract video ID from YouTube embed URL
  const getVideoId = (url: string) => {
    return url.split('/').pop();
  };

  // Function to open video in fullscreen modal
  const openVideo = (videoUrl: string) => {
    setActiveVideo(videoUrl);
  };

  // Function to close fullscreen modal
  const closeVideo = () => {
    setActiveVideo(null);
  };

  // Function to format viewer count
  const formatViewers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/gaming-bg.jpg')] bg-cover bg-center opacity-20 scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/90 via-[#0A0A0B]/50 to-[#0A0A0B]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm mb-8">
                <Sparkles className="h-5 w-5 text-indigo-400 mr-2" />
                <span className="text-indigo-400 font-medium">Our Portfolio</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pb-4">
                  Gaming & Esports
                </span>
                <span className="block text-white mt-2">Showcase</span>
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Explore our portfolio of gaming events, esports tournaments, and content creation projects.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Live Streams Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#0A0A0B] to-[#12121A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-center mb-12"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-500">
              Live Streams
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {liveStreams.map((stream) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-red-500/50 transition-all duration-300"
              >
                <div className="relative aspect-video">
                  <img
                    src={stream.thumbnailUrl}
                    alt={stream.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  
                  {/* Live Badge */}
                  {stream.status === 'live' && (
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <span className="flex items-center px-3 py-1 rounded-full bg-red-600 text-white text-sm font-medium">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                        LIVE
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gray-900/80 text-white text-sm">
                        {formatViewers(stream.viewers || 0)} viewers
                      </span>
                    </div>
                  )}

                  {/* Platform Icon */}
                  <div className="absolute top-4 right-4">
                    {stream.platform === 'Twitch' ? (
                      <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{stream.title}</h3>
                  <p className="text-gray-400 mb-4">{stream.game}</p>
                  
                  <a
                    href={stream.streamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    {stream.status === 'live' ? 'Watch Now' : 'Set Reminder'}
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Gaming Achievements Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#12121A] to-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-center mb-12"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
              Gaming Achievements
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{achievement.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{achievement.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{achievement.game}</p>
                <p className="text-gray-500 text-sm">{achievement.description}</p>
                <p className="text-yellow-500 text-sm mt-4">
                  {new Date(achievement.date).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Projects Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#0A0A0B] to-[#12121A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-center mb-12"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Featured Projects
            </span>
          </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-10">
          {featuredProjects.map((project) => (
            <motion.div 
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50"
            >
                <div className="relative aspect-w-16 aspect-h-9">
                  <iframe 
                    className="w-full h-80"
                    src={`${project.youtubeEmbed}?rel=0`}
                    title={`${project.title} - YouTube`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
                  </iframe>
                  <button 
                    onClick={() => openVideo(project.youtubeEmbed)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300"
                  >
                    <span className="bg-red-600 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Watch Project Showcase
                    </span>
                  </button>
                </div>
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {project.category}
                  </span>
              </div>
              
              <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-white">{project.title}</h3>
                  <p className="text-gray-400 mb-6 text-lg">{project.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {project.stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                        <div className="text-2xl font-bold text-indigo-400">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mb-6">
                    <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech} 
                          className="bg-gray-700/50 text-gray-200 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="relative py-20 bg-gradient-to-b from-[#12121A] to-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-center mb-12"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              More Projects
            </span>
          </motion.h2>
          
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => setHoveredProject(project.title)}
              onHoverEnd={() => setHoveredProject(null)}
                className="group relative overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50"
            >
                <div className="relative aspect-w-16 aspect-h-9">
                      <iframe 
                    className="w-full h-64"
                    src={`${project.youtubeEmbed}?rel=0`}
                        title={`${project.title} - YouTube`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                      </iframe>
                  <button 
                    onClick={() => openVideo(project.youtubeEmbed)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300"
                  >
                    <motion.span 
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center text-sm"
                    >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                      Play
                    </motion.span>
                  </button>
                </div>
                <div className="absolute top-4 left-4 z-10">
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {project.category}
                  </motion.span>
              </div>
              
              <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-white">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                
                {project.tags && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span 
                          key={tag} 
                            className="bg-gray-700/50 text-gray-200 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => openVideo(project.youtubeEmbed)}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center group"
                  >
                    <span>View Project</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                  </button>
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#0A0A0B] to-[#12121A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold mb-8"
          >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                Ready to Level Up?
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto mb-12"
            >
              Join our platform and take your gaming experience to the next level. Whether you're a player, team, or tournament organizer, we've got you covered.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <motion.button 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(99,102,241,0.3)]"
              >
                <span className="relative z-10 flex items-center">
                  Get Started
                  <Gamepad2 className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
          
              <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-gray-800/50 text-white backdrop-blur-sm border border-gray-700/50 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-indigo-500/50"
                >
                Learn More
                <Trophy className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </div>
            </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          >
            <div className="relative w-full max-w-5xl">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden"
              >
                <iframe 
                  className="w-full h-full"
                  src={`${activeVideo}?rel=0&autoplay=1`}
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                transition={{ duration: 0.2 }}
                onClick={closeVideo}
                className="absolute -top-12 right-0 text-white hover:text-indigo-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;