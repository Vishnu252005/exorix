import React from 'react';
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
import { 
  FadeIn, 
  FadeInUp, 
  FadeInDown, 
  StaggerContainer,
  StaggerItem,
  HoverScale,
  HoverElevate,
  AnimatedButton
} from '../components/animations/AnimatedElements';

const Services = () => {
  const services = [
    {
      icon: <Trophy className="w-12 h-12" />,
      title: 'Esports Tournaments',
      description: 'Professional tournament hosting and management for competitive gaming events, from local competitions to international championships.',
      features: [
        'Custom tournament brackets',
        'Prize pool management',
        'Team registration system',
        'Live streaming integration',
        'Match scheduling',
        'Results tracking'
      ]
    },
    {
      icon: <Gamepad2 className="w-12 h-12" />,
      title: 'Gaming Infrastructure',
      description: 'State-of-the-art gaming facilities and technical support for optimal competitive gaming experience.',
      features: [
        'High-performance gaming PCs',
        'Low-latency networking',
        'Dedicated servers',
        'Anti-cheat systems',
        'Game optimization',
        'Technical support'
      ]
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Team Management',
      description: 'Comprehensive tools and services for esports teams to manage their roster, training, and competitions.',
      features: [
        'Team registration',
        'Player profiles',
        'Match history',
        'Performance analytics',
        'Team communication',
        'Scouting tools'
      ]
    },
    {
      icon: <Video className="w-12 h-12" />,
      title: 'Content Creation',
      description: 'Professional content production services for esports organizations and streamers.',
      features: [
        'Tournament highlights',
        'Team documentaries',
        'Player interviews',
        'Social media content',
        'Stream overlays',
        'Brand promotion'
      ]
    }
  ];

  const stats = [
    {
      value: '100+',
      label: 'Tournaments Hosted',
      icon: <Trophy className="h-6 w-6" />
    },
    {
      value: '50,000+',
      label: 'Active Players',
      icon: <Users className="h-6 w-6" />
    },
    {
      value: '$1M+',
      label: 'Prize Pools',
      icon: <Medal className="h-6 w-6" />
    },
    {
      value: '24/7',
      label: 'Support',
      icon: <Shield className="h-6 w-6" />
    }
  ];

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
            <FadeInDown>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm mb-8">
                <Sparkles className="h-5 w-5 text-indigo-400 mr-2" />
                <span className="text-indigo-400 font-medium">Our Services</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pb-4">
                  Gaming & Esports
                </span>
                <span className="block text-white mt-2">Services</span>
              </h1>
            </FadeInDown>
            
            <FadeIn delay={0.2}>
              <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Comprehensive esports solutions for tournaments, teams, and content creators. Elevate your gaming experience with our professional services.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#0A0A0B] to-[#12121A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <HoverElevate>
                  <div className="p-8 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 rounded-xl bg-indigo-500/20">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                      <div className="text-gray-400">{stat.label}</div>
                    </div>
                  </div>
                </HoverElevate>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Services Grid */}
      <div className="relative py-20 bg-gradient-to-b from-[#12121A] to-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                Our Services
              </span>
            </h2>
          </FadeInUp>
          
          <StaggerContainer className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
              <StaggerItem key={service.title}>
                <HoverScale>
                  <div className="group relative overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50">
                    <div className="p-8">
                      <div className="flex items-center mb-4">
                        <div className="p-3 rounded-xl bg-indigo-500/20">
                {service.icon}
              </div>
                        <h3 className="text-xl font-bold text-white ml-4">{service.title}</h3>
                      </div>
                      <p className="text-gray-400 mb-6">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                          <li key={feature} className="flex items-center text-gray-400">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
                  </div>
                </HoverScale>
              </StaggerItem>
          ))}
          </StaggerContainer>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#0A0A0B] to-[#12121A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FadeInUp>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                  Ready to Level Up?
                </span>
              </h2>
            </FadeInUp>
            
            <FadeIn delay={0.2}>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
                Join our platform and take your gaming experience to the next level. Whether you're a player, team, or tournament organizer, we've got you covered.
              </p>
            </FadeIn>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <FadeInUp delay={0.3}>
                <AnimatedButton>
                  <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(99,102,241,0.3)]">
                    <span className="relative z-10 flex items-center">
                      Get Started
                      <Gamepad2 className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </AnimatedButton>
              </FadeInUp>
              
              <FadeInUp delay={0.4}>
                <AnimatedButton>
                  <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-gray-800/50 text-white backdrop-blur-sm border border-gray-700/50 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-indigo-500/50">
                    Learn More
                    <Trophy className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </AnimatedButton>
              </FadeInUp>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;