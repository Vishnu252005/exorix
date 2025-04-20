import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
  Crown
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
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
      if (heroRef.current) {
        heroRef.current.style.backgroundPositionY = `${scrollY * 0.5}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

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
      name: 'Fortnite',
      image: 'https://cdn1.epicgames.com/offer/fn/23BR_C4S1_EGS_Launcher_Blade_2560x1440_2560x1440-437d0424d977f7bfa4c494f3248f4147',
      players: '35K+',
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
      image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2070&auto=format&fit=crop'
    },
    {
      type: 'Stream',
      title: 'Pro Player Stream',
      description: 'Watch top-ranked player live on Twitch',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop'
    },
    {
      type: 'Community',
      title: 'Community Tournament',
      description: 'Join our weekly community tournament',
      image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=2084&auto=format&fit=crop'
    }
  ];

  const trendingStreamers = [
    {
      name: 'ProGamer123',
      game: 'VALORANT',
      viewers: '12.5K',
      image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2070&auto=format&fit=crop',
      status: 'Live'
    },
    {
      name: 'NinjaWarrior',
      game: 'Fortnite',
      viewers: '8.2K',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
      status: 'Live'
    },
    {
      name: 'PixelMaster',
      game: 'League of Legends',
      viewers: '15.7K',
      image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=2084&auto=format&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Global Esports Cup',
      date: 'August 5, 2024',
      game: 'League of Legends',
      prize: '$50,000',
      teams: '16',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop'
    },
    {
      title: 'Pro Series Finals',
      date: 'September 1, 2024',
      game: 'CS:GO',
      prize: '$30,000',
      teams: '24',
      image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=2084&auto=format&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden">
      {/* Hero Section with Parallax Effect */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/gaming-bg.jpg')] bg-cover bg-center opacity-20 scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/90 via-[#0A0A0B]/50 to-[#0A0A0B]" />
          
          {/* Animated Grid */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10 animate-grid" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-pulse" />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Large Orbs */}
            <div className="floating-elements">
              {[...Array(15)].map((_, i) => (
                <div
                  key={`orb-${i}`}
                  className="absolute rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-float blur-sm"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 150 + 50}px`,
                    height: `${Math.random() * 150 + 50}px`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${15 + Math.random() * 15}s`
                  }}
                />
              ))}
            </div>

            {/* Small Particles */}
            <div className="particles">
              {[...Array(30)].map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className="absolute rounded-full bg-white/30 animate-particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${10 + Math.random() * 20}s`
                  }}
                />
              ))}
            </div>

            {/* Glowing Lines */}
            <div className="lines">
              {[...Array(10)].map((_, i) => (
                <div
                  key={`line-${i}`}
                  className="absolute bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent animate-line"
                  style={{
                    left: '0',
                    top: `${Math.random() * 100}%`,
                    width: '100%',
                    height: '1px',
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${5 + Math.random() * 10}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center space-y-8">
            <FadeInDown>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm mb-8">
                <Sparkles className="h-5 w-5 text-indigo-400 mr-2" />
                <span className="text-indigo-400 font-medium">The Ultimate Gaming Experience</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pb-4">
                  Level Up Your
                </span>
                <span className="block text-white mt-2">Gaming Journey</span>
              </h1>
            </FadeInDown>
            
            <FadeIn delay={0.2}>
              <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Join the ultimate gaming platform where legends are born. Compete in epic tournaments, win amazing prizes, and become a gaming icon.
              </p>
            </FadeIn>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
              <FadeInUp delay={0.3}>
                <AnimatedButton>
                  <Link
                    to="/signup"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(99,102,241,0.3)]"
                  >
                    <span className="relative z-10 flex items-center">
                      Join Now
                      <Trophy className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </AnimatedButton>
              </FadeInUp>
              
              <FadeInUp delay={0.4}>
                <AnimatedButton>
                  <Link
                    to="/tournaments"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-gray-800/50 text-white backdrop-blur-sm border border-gray-700/50 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-indigo-500/50"
                  >
                    Browse Tournaments
                    <Gamepad2 className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </AnimatedButton>
              </FadeInUp>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4">
              <FadeIn delay={0.5}>
                <div className="flex flex-col items-center p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
                  <span className="text-4xl font-bold text-indigo-400">50K+</span>
                  <span className="mt-2 text-gray-400">Active Players</span>
                </div>
              </FadeIn>
              <FadeIn delay={0.6}>
                <div className="flex flex-col items-center p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
                  <span className="text-4xl font-bold text-purple-400">100+</span>
                  <span className="mt-2 text-gray-400">Daily Tournaments</span>
                </div>
              </FadeIn>
              <FadeIn delay={0.7}>
                <div className="flex flex-col items-center p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
                  <span className="text-4xl font-bold text-pink-400">$500K</span>
                  <span className="mt-2 text-gray-400">Prize Pool</span>
                </div>
              </FadeIn>
              <FadeIn delay={0.8}>
                <div className="flex flex-col items-center p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
                  <span className="text-4xl font-bold text-amber-400">24/7</span>
                  <span className="mt-2 text-gray-400">Support</span>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-scroll" />
          </div>
        </div>
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

      <style jsx="true">{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          33% { transform: translateY(-30px) rotate(5deg) scale(1.1); }
          66% { transform: translateY(20px) rotate(-5deg) scale(0.9); }
          100% { transform: translateY(0) rotate(0deg) scale(1); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        @keyframes particle {
          0% { 
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% { 
            transform: translateY(-100vh) translateX(100px);
            opacity: 0;
          }
        }
        .animate-particle {
          animation: particle 15s linear infinite;
        }

        @keyframes line {
          0% {
            transform: translateX(-100%) scaleY(1);
            opacity: 0;
          }
          50% {
            transform: translateX(0) scaleY(1);
            opacity: 0.5;
          }
          100% {
            transform: translateX(100%) scaleY(1);
            opacity: 0;
          }
        }
        .animate-line {
          animation: line 10s linear infinite;
        }

        @keyframes grid {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(-50%) translateY(-50%); }
        }
        .animate-grid {
          animation: grid 50s linear infinite;
        }

        @keyframes scroll {
          0% { transform: translateY(0); }
          50% { transform: translateY(6px); }
          100% { transform: translateY(0); }
        }
        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;