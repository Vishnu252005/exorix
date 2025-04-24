import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  Shield, 
  Zap, 
  Users, 
  Globe, 
  ChevronRight,
  Gamepad2,
  Trophy,
  Sword,
  Target,
  Medal,
  Flame,
  Calendar,
  Sparkles,
  Crown,
  Boxes,
  ExternalLink
} from 'lucide-react';
import ExorixLogo from '../assets/exorix-logo.svg';
import HeroBackground from '../components/HeroBackground';
import { 
  FadeIn, 
  FadeInUp, 
  FadeInDown, 
  FadeInLeft, 
  FadeInRight,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
  HoverScale,
  HoverElevate,
  AnimatedButton
} from '../components/animations/AnimatedElements';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      controls.start({
        y: window.scrollY * 0.5,
        transition: { type: "spring", stiffness: 100 }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [controls]);

  const stats = [
    { 
      value: '50K+', 
      label: 'Players', 
      icon: Users, 
      color: 'from-purple-500 to-indigo-500',
      description: 'Active gamers worldwide',
      increment: { start: 0, end: 50000, duration: 2 }
    },
    { 
      value: '1000+', 
      label: 'Tournaments', 
      icon: Trophy, 
      color: 'from-emerald-500 to-cyan-500',
      description: 'Monthly competitions',
      increment: { start: 0, end: 1000, duration: 1.5 }
    },
    { 
      value: '$100K+', 
      label: 'Prize Pool', 
      icon: Crown, 
      color: 'from-rose-500 to-orange-500',
      description: 'Monthly rewards',
      increment: { start: 0, end: 100000, duration: 2.5 }
    }
  ];

  const navItems = [
    { name: 'Games', icon: Gamepad2 },
    { name: 'Tournaments', icon: Trophy },
    { name: 'Community', icon: Users }
  ];

  const features = [
    {
      icon: Gamepad2,
      title: 'Epic Tournaments',
      description: 'Compete in thrilling tournaments with players from around the globe.',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Trophy,
      title: 'Amazing Prizes',
      description: 'Win incredible rewards and establish yourself as a gaming legend.',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      icon: Sword,
      title: 'Skill-Based Matchmaking',
      description: 'Face opponents of your caliber for the perfect gaming challenge.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Target,
      title: 'Live Streaming',
      description: 'Stream your matches live and build your following.',
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      icon: Medal,
      title: 'Ranking System',
      description: 'Climb the leaderboards and prove your gaming prowess.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Crown,
      title: 'Pro League',
      description: 'Join the elite ranks of professional gamers in our exclusive league.',
      gradient: 'from-yellow-500 to-amber-500'
    }
  ];

  const testimonials = [
    {
      name: 'DragonSlayer99',
      role: 'Pro Gamer',
      content: 'This platform has taken my gaming career to the next level. The tournaments are intense and the community is amazing!',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      badge: 'Tournament Champion'
    },
    {
      name: 'NinjaWarrior',
      role: 'Esports Coach',
      content: 'The best platform for competitive gaming. The matchmaking system is perfect and the prizes are incredible.',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      badge: 'Verified Pro'
    },
    {
      name: 'PixelPirate',
      role: 'Content Creator',
      content: 'Streaming features are top-notch. I\'ve grown my audience significantly since joining the platform.',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      badge: 'Featured Streamer'
    }
  ];

  const popularGames = [
    {
      name: 'VALORANT',
      image: 'https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_VALORANT_RiotGames_S1_2560x1440-b88adde6a57e40aa85818820aa87a6cd',
      players: '25K+',
      tournaments: 'Weekly'
    },
    {
      name: 'League of Legends',
      image: 'https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_LeagueofLegends_RiotGames_S1_2560x1440-ee500721c06da3ec1e5535a88588c77f',
      players: '30K+',
      tournaments: 'Daily'
    },
    {
      name: 'CS:GO',
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/730/capsule_616x353.jpg',
      players: '20K+',
      tournaments: 'Weekly'
    },
    {
      name: 'PUBG Mobile',
      image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=2070&auto=format&fit=crop',
      players: '40K+',
      tournaments: 'Daily'
    }
  ];

  const liveTournaments = [
    {
      game: 'VALORANT',
      title: 'Exorix Championship Series',
      prize: '$10,000',
      teams: '32/32',
      status: 'Live'
    },
    {
      game: 'League of Legends',
      title: 'Summer Split Finals',
      prize: '$15,000',
      teams: '16/16',
      status: 'Live'
    },
    {
      game: 'CS:GO',
      title: 'Global Showdown',
      prize: '$8,000',
      teams: '24/24',
      status: 'Live'
    }
  ];

  const communityHighlights = [
    {
      type: 'Achievement',
      title: 'New Champion Crowned',
      description: 'Team Phoenix wins the Exorix Championship Series',
      image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2070&auto=format&fit=crop'
    },
    {
      type: 'Stream',
      title: 'Pro Player Stream',
      description: 'Watch top-ranked player live on Twitch',
      image: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?q=80&w=2070&auto=format&fit=crop'
    },
    {
      type: 'Community',
      title: 'Community Tournament',
      description: 'Join our weekly community tournament',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  const trendingStreamers = [
    {
      name: 'ProGamer123',
      game: 'VALORANT',
      viewers: '12.5K',
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2070&auto=format&fit=crop',
      status: 'Live'
    },
    {
      name: 'NinjaWarrior',
      game: 'Fortnite',
      viewers: '8.2K',
      image: 'https://images.unsplash.com/photo-1586182987320-4f376d39d787?q=80&w=2070&auto=format&fit=crop',
      status: 'Live'
    },
    {
      name: 'PixelMaster',
      game: 'League of Legends',
      viewers: '15.7K',
      image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2070&auto=format&fit=crop',
      status: 'Live'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Summer Championship',
      date: 'July 15, 2024',
      game: 'VALORANT',
      prize: '$25,000',
      teams: '32',
      image: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Global Esports Cup',
      date: 'August 5, 2024',
      game: 'League of Legends',
      prize: '$50,000',
      teams: '16',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Pro Series Finals',
      date: 'September 1, 2024',
      game: 'CS:GO',
      prize: '$30,000',
      teams: '24',
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden">
      {/* Hero Section with Enhanced Effects */}
      <div className="min-h-screen bg-[#0D0B1F] relative overflow-hidden perspective-1000" ref={containerRef}>
        {/* Enhanced Mouse Follow Effect */}
        <div 
          className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
          style={{
            background: `
              radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, 
                rgba(79, 70, 229, 0.15),
                rgba(147, 51, 234, 0.1),
                transparent 80%
              )
            `
          }}
        />

        {/* Enhanced Cyber Grid Effect */}
        <div 
          className="fixed inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(transparent 0%, rgba(79, 70, 229, 0.05) 2%, transparent 3%),
              linear-gradient(90deg, transparent 0%, rgba(147, 51, 234, 0.05) 2%, transparent 3%)
            `,
            backgroundSize: '30px 30px',
            transform: `translateY(${scrollY * 0.2}px) rotate(-5deg) scale(1.5)`,
            transition: 'transform 0.2s ease-out'
          }}
        />
          
        {/* Enhanced Background Effects */}
          <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A123D] via-[#0D0B1F] to-[#0D0B1F]" />

          {/* Enhanced Animated Orbs */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, Math.random() * 200 - 100, 0],
                  y: [0, Math.random() * 200 - 100, 0],
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0]
                }}
                transition={{
                  duration: 15 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute rounded-full blur-[120px] opacity-20"
                  style={{
                  top: `${20 + i * 15}%`,
                  left: `${10 + i * 20}%`,
                  width: `${200 + i * 100}px`,
                  height: `${200 + i * 100}px`,
                  background: `linear-gradient(45deg, 
                    ${i % 2 === 0 ? '#4F46E5' : '#9333EA'}, 
                    ${i % 2 === 0 ? '#EC4899' : '#4F46E5'}
                  )`,
                  filter: 'blur(60px)',
                  mixBlendMode: 'lighten'
                  }}
                />
              ))}
            </div>

          {/* Enhanced Particle Effect */}
          <div className="absolute inset-0">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [-20, window.innerHeight + 20],
                  x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 8 + Math.random() * 15,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 5
                }}
                className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                  opacity: 0.2 + Math.random() * 0.3,
                  transform: `scale(${0.5 + Math.random()})`,
                  boxShadow: `0 0 ${10 + Math.random() * 20}px rgba(255,255,255,0.3)`
                  }}
                />
              ))}
          </div>
            </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Enhanced Navigation Bar */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-10 flex gap-8 bg-white/[0.03] backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.2)]"
          >
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-2 px-6 py-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] to-[#9333EA] opacity-0 group-hover:opacity-10 rounded-lg transition-all duration-300" />
                <div className="relative z-10 flex items-center gap-2">
                  <item.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-gray-300 group-hover:text-white transition-colors">{item.name}</span>
                  <motion.div 
                    className="w-1 h-1 rounded-full bg-white/50 group-hover:bg-white transition-colors"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </motion.button>
            ))}
          </motion.div>

          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-40">
            <div className="flex items-start justify-between">
              {/* Left Content */}
              <div className="max-w-xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative">
                    <motion.div
                      animate={{
                        background: [
                          'linear-gradient(45deg, #4F46E5, #9333EA, #EC4899)',
                          'linear-gradient(45deg, #9333EA, #EC4899, #4F46E5)',
                          'linear-gradient(45deg, #EC4899, #4F46E5, #9333EA)',
                        ],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="absolute -inset-1 rounded-lg blur-xl opacity-30"
                    />
                    <h1 className="relative text-6xl font-bold leading-tight mb-6 perspective-1000">
                      <motion.span
                        initial={{ rotateX: -90 }}
                        animate={{ rotateX: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="block"
                      >
                        Exorix Gaming,
                      </motion.span>
                      <motion.span
                        initial={{ rotateX: -90 }}
                        animate={{ rotateX: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="block"
                      >
                        Your Ultimate
                      </motion.span>
                      <motion.div
                        initial={{ rotateX: -90 }}
                        animate={{ rotateX: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="relative inline-block"
                      >
                        <div className="relative">
                          {/* Animated background for Gaming Hub text */}
                          <motion.div
                            className="absolute -inset-2 rounded-lg"
                            animate={{
                              background: [
                                'linear-gradient(90deg, #4F46E5, #9333EA, #EC4899)',
                                'linear-gradient(90deg, #EC4899, #4F46E5, #9333EA)',
                                'linear-gradient(90deg, #9333EA, #EC4899, #4F46E5)',
                              ],
                              boxShadow: [
                                '0 0 20px rgba(79, 70, 229, 0.5)',
                                '0 0 25px rgba(236, 72, 153, 0.5)',
                                '0 0 20px rgba(147, 51, 234, 0.5)',
                              ]
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                  style={{
                              filter: 'blur(20px)',
                              opacity: 0.3,
                            }}
                          />

                          {/* Main Gaming Hub text with shimmer effect */}
                          <div className="relative">
                            <motion.span 
                              className="relative inline-block text-transparent bg-clip-text font-black"
                              style={{
                                backgroundImage: 'linear-gradient(90deg, #4F46E5, #9333EA, #EC4899, #9333EA, #4F46E5)',
                                backgroundSize: '200% 100%',
                              }}
                              animate={{
                                backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              Gaming Hub
                            </motion.span>

                            {/* Shimmer overlay */}
                            <motion.div
                              className="absolute inset-0 pointer-events-none"
                              animate={{
                                background: [
                                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                                  'linear-gradient(90deg, transparent 100%, rgba(255,255,255,0.2) 150%, transparent 200%)',
                                ],
                                backgroundSize: ['200% 100%', '200% 100%'],
                                backgroundPosition: ['100% 0%', '-100% 0%'],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />

                            {/* Sparkle effects */}
                            <div className="absolute -right-8 -top-1 flex items-center space-x-1">
                              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                              <motion.div
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                                className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                              />
          </div>
        </div>

                          {/* Glowing line under text */}
                          <motion.div
                            className="absolute -bottom-2 left-0 w-full h-[2px] rounded-full"
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{
                              scaleX: [0, 1, 1, 0],
                              opacity: [0, 1, 1, 0],
                              background: [
                                'linear-gradient(90deg, transparent, #4F46E5, transparent)',
                                'linear-gradient(90deg, transparent, #EC4899, transparent)',
                                'linear-gradient(90deg, transparent, #9333EA, transparent)',
                              ],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "reverse",
                              ease: "easeInOut",
                            }}
                          />
              </div>
                      </motion.div>
              </h1>
                  </div>
            
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-gray-400 text-lg mb-8 leading-relaxed"
                  >
                    Join the ultimate gaming destination where legends are born.
                    Compete in epic tournaments, win amazing prizes, and become
                    part of a thriving global gaming community.
                  </motion.p>

                  <div className="flex gap-4 mb-12">
                    <Link to="/esports">
                      <motion.button
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: '0 0 30px rgba(79, 70, 229, 0.4)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4F46E5] to-[#9333EA] rounded-full font-medium text-white transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#9333EA] to-[#4F46E5] opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
                        <div className="relative z-10 flex items-center gap-2">
                          <img src={ExorixLogo} alt="" className="w-5 h-5" />
                          <span className="relative">
                            Join Tournament
                            <motion.div
                              className="absolute bottom-0 left-0 w-full h-[1px] bg-white/50"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                            />
                    </span>
                          <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.button>
                  </Link>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative flex items-center gap-2 px-8 py-4 bg-white/5 text-white rounded-full font-medium transition-all duration-300 border border-white/10 hover:border-white/20 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <div className="relative z-10 flex items-center gap-2">
                        Learn More
                        <ExternalLink className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.button>
            </div>

                  {/* Stats Section */}
                  <div className="grid grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group relative bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300"
                      >
                        <div 
                          className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl" 
                          style={{ background: `linear-gradient(45deg, ${stat.color})`, opacity: 0.05 }} 
                        />
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-3">
                            <stat.icon className={`w-6 h-6 transition-all duration-300 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                            <Zap className="w-4 h-4 text-white/30 group-hover:text-white/50 transition-colors" />
                </div>
                          <div className="text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                            {stat.value}
                </div>
                          <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                            {stat.label}
                </div>
                          <div className="mt-2 text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                            {stat.description}
                </div>
            </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden rounded-b-2xl">
                          <motion.div
                            className="w-full h-full bg-gradient-to-r"
                            style={{ background: `linear-gradient(to right, ${stat.color})` }}
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "0%" }}
                            transition={{ duration: 0.3 }}
                          />
          </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
        </div>

              {/* Right Content - Game Cards */}
              <div className="flex-1 relative ml-20">
                <div className="grid grid-cols-2 gap-6 relative" style={{ height: '80vh' }}>
                  {popularGames.map((game, index) => (
                    <motion.div
                      key={game.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      className="relative rounded-2xl overflow-hidden group perspective-1000"
                      onHoverStart={() => setHoveredImage(index)}
                      onHoverEnd={() => setHoveredImage(null)}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                      />
                      <motion.div
                        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                      />
                      <motion.img
                        src={game.image}
                        alt={game.name}
                        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: hoveredImage === index ? "scale(1.1) rotateY(5deg)" : "scale(1) rotateY(0deg)"
                        }}
                      />
                      <AnimatePresence>
                        {hoveredImage === index && (
                          <motion.div
                            initial={{ opacity: 0, y: 20, rotateX: -20 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            exit={{ opacity: 0, y: 20, rotateX: 20 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end z-30 backdrop-blur-sm"
                          >
                            <motion.h3 
                              className="text-xl font-bold text-white mb-2"
                              initial={{ x: -20 }}
                              animate={{ x: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                            >
                              {game.name}
                            </motion.h3>
                            <motion.div 
                              className="flex items-center gap-4 text-gray-300"
                              initial={{ x: -20 }}
                              animate={{ x: 0 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                            >
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>{game.players}</span>
          </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{game.tournaments}</span>
        </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced styles */}
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.05); opacity: 0.4; }
          }

          @keyframes firefly {
            0% { transform: translate(0, 0) scale(0); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translate(100px, -100px) scale(1); opacity: 0; }
          }

          .perspective-1000 {
            perspective: 1000px;
          }

          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 8s linear infinite;
          }

          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          @keyframes glow {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.2); }
          }

          .hover-glow:hover {
            animation: glow 2s ease-in-out infinite;
          }
        `}</style>
      </div>

      {/* Features Section */}
      <div className="relative py-32 bg-gradient-to-b from-[#0A0A0B] to-[#12121A]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FadeInUp>
              <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                Epic Features
              </h2>
            </FadeInUp>
            
            <FadeIn delay={0.2}>
              <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
                Everything you need to dominate the gaming world.
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="mt-20">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <StaggerItem key={feature.title}>
                  <HoverElevate>
                    <div className="group relative p-8 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 transition-all duration-500 hover:border-indigo-500/50 hover:bg-gray-800/50">
                      <div className="relative">
                        <ScaleIn>
                          <span className={`inline-flex items-center justify-center p-3 bg-gradient-to-r ${feature.gradient} rounded-xl shadow-lg ring-1 ring-white/10 group-hover:shadow-[0_0_30px_4px_rgba(99,102,241,0.2)] transition-all duration-500`}>
                            <feature.icon className="h-7 w-7 text-white" aria-hidden="true" />
                          </span>
                        </ScaleIn>
                        <h3 className="mt-6 text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="mt-4 text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </HoverElevate>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative py-32 bg-gradient-to-b from-[#12121A] to-[#0A0A0B]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/stars.svg')] bg-repeat opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FadeInUp>
              <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
                Gaming Legends
              </h2>
            </FadeInUp>
            
            <FadeIn delay={0.2}>
              <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
                Join our community of elite gamers and rising stars.
              </p>
            </FadeIn>
          </div>
          
          <StaggerContainer className="mt-20">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <StaggerItem key={testimonial.name}>
                  <HoverScale>
                    <div className="group relative p-8 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50 hover:bg-gray-800/50">
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            className="h-14 w-14 rounded-full ring-2 ring-indigo-500 p-[2px] bg-gradient-to-r from-indigo-500 to-purple-500"
                            src={testimonial.image}
                            alt={testimonial.name}
                          />
                          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-1">
                            <Trophy className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-indigo-400">
                            {testimonial.role}
                          </p>
                          <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                            {testimonial.badge}
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6">
                        <svg className="absolute -top-4 -left-3 h-8 w-8 text-gray-700 transform -rotate-12" fill="currentColor" viewBox="0 0 32 32">
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>
                        <p className="relative text-gray-300 leading-relaxed">
                          "{testimonial.content}"
                        </p>
                      </div>
                    </div>
                  </HoverScale>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </div>

      {/* Popular Games Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#0A0A0B] to-[#12121A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                Popular Games
              </span>
            </h2>
          </FadeInUp>
          
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularGames.map((game, index) => (
              <StaggerItem key={game.name} delay={index * 0.1}>
                <HoverScale>
                  <div className="group relative overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50">
                    <img
                      src={game.image}
                      alt={game.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{game.players} Players</span>
                        <span>{game.tournaments} Tournaments</span>
                      </div>
                    </div>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Live Tournaments Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#12121A] to-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
                Live Tournaments
              </span>
            </h2>
          </FadeInUp>
          
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {liveTournaments.map((tournament, index) => (
              <StaggerItem key={tournament.title} delay={index * 0.1}>
                <HoverElevate>
                  <div className="group relative p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-400">
                        {tournament.game}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                        {tournament.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{tournament.title}</h3>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Prize: {tournament.prize}</span>
                      <span>Teams: {tournament.teams}</span>
                    </div>
                  </div>
                </HoverElevate>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Community Highlights Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#0A0A0B] to-[#12121A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                Community Highlights
              </span>
            </h2>
          </FadeInUp>
          
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {communityHighlights.map((highlight, index) => (
              <StaggerItem key={highlight.title} delay={index * 0.1}>
                <HoverScale>
                  <div className="group relative overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50">
                    <img
                      src={highlight.image}
                      alt={highlight.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="p-6">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400 mb-2 inline-block">
                        {highlight.type}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-2">{highlight.title}</h3>
                      <p className="text-gray-400">{highlight.description}</p>
                    </div>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Trending Streamers Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#0A0A0B] to-[#12121A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
                Trending Streamers
              </span>
            </h2>
          </FadeInUp>
          
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingStreamers.map((streamer, index) => (
              <StaggerItem key={streamer.name} delay={index * 0.1}>
                <HoverScale>
                  <div className="group relative overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50">
                    <div className="relative">
                      <img
                        src={streamer.image}
                        alt={streamer.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
                          {streamer.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{streamer.name}</h3>
                        <span className="text-sm text-gray-400">{streamer.viewers} viewers</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-400">
                        {streamer.game}
                      </span>
                    </div>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#12121A] to-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                Upcoming Events
              </span>
            </h2>
          </FadeInUp>
          
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <StaggerItem key={event.title} delay={index * 0.1}>
                <HoverElevate>
                  <div className="group relative overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400">
                          {event.game}
                        </span>
                        <span className="text-sm text-gray-400">{event.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Prize: {event.prize}</span>
                        <span>Teams: {event.teams}</span>
                      </div>
                    </div>
                  </div>
                </HoverElevate>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#0A0A0B] to-[#12121A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StaggerItem>
              <HoverScale>
                <div className="p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 text-center">
                  <div className="text-4xl font-bold text-indigo-400 mb-2">50K+</div>
                  <div className="text-gray-400">Active Players</div>
                </div>
              </HoverScale>
            </StaggerItem>
            <StaggerItem delay={0.1}>
              <HoverScale>
                <div className="p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">100+</div>
                  <div className="text-gray-400">Daily Tournaments</div>
                </div>
              </HoverScale>
            </StaggerItem>
            <StaggerItem delay={0.2}>
              <HoverScale>
                <div className="p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 text-center">
                  <div className="text-4xl font-bold text-pink-400 mb-2">$500K</div>
                  <div className="text-gray-400">Prize Pool</div>
                </div>
              </HoverScale>
            </StaggerItem>
            <StaggerItem delay={0.3}>
              <HoverScale>
                <div className="p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 text-center">
                  <div className="text-4xl font-bold text-amber-400 mb-2">24/7</div>
                  <div className="text-gray-400">Support</div>
                </div>
              </HoverScale>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#12121A] to-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
                Why Choose Us
              </span>
            </h2>
          </FadeInUp>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeInUp delay={0.1}>
              <div className="p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl bg-indigo-500/20">
                    <Shield className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white ml-4">Secure Platform</h3>
                </div>
                <p className="text-gray-400">
                  Your data and transactions are protected with enterprise-grade security measures.
                </p>
              </div>
            </FadeInUp>
            
            <FadeInUp delay={0.2}>
              <div className="p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <Zap className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white ml-4">Fast Matchmaking</h3>
                </div>
                <p className="text-gray-400">
                  Get matched with players of similar skill level in seconds.
                </p>
              </div>
            </FadeInUp>
            
            <FadeInUp delay={0.3}>
              <div className="p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl bg-pink-500/20">
                    <Users className="h-6 w-6 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white ml-4">Active Community</h3>
                </div>
                <p className="text-gray-400">
                  Join thousands of passionate gamers in our thriving community.
                </p>
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover filter brightness-[0.2]"
            src="/gaming-arena.jpg"
            alt="Gaming arena"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-indigo-900/30 to-[#0A0A0B]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <FadeInLeft>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="block text-white">Ready to Compete?</span>
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  Your Legend Begins Here
                </span>
              </h2>
            </FadeInLeft>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-6 lg:mt-0 lg:flex-shrink-0">
              <FadeInRight delay={0.2}>
                <AnimatedButton>
                  <Link
                    to="/signup"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(99,102,241,0.3)]"
                  >
                    <span className="relative z-10 flex items-center">
                      Start Gaming
                      <Flame className="ml-2 h-5 w-5 group-hover:scale-125 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </AnimatedButton>
              </FadeInRight>
              
              <FadeInRight delay={0.3}>
                <AnimatedButton>
                  <Link
                    to="/tournaments"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-gray-800/50 text-white backdrop-blur-sm border border-gray-700/50 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-indigo-500/50"
                  >
                    View Tournaments
                    <Trophy className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  </Link>
                </AnimatedButton>
              </FadeInRight>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;