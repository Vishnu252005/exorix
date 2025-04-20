import React from 'react';
import { 
  Users, 
  Target, 
  Heart, 
  Trophy, 
  Gamepad2, 
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

const About = () => {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
      expertise: 'Esports Management',
      achievements: 'Former Pro Gamer, 10+ Years Industry Experience'
    },
    {
      name: 'Michael Chen',
      role: 'Technical Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
      expertise: 'Game Development',
      achievements: 'Lead Developer of 5 Major Gaming Platforms'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
      expertise: 'Digital Design',
      achievements: 'Award-Winning UI/UX Designer'
    },
    {
      name: 'David Kim',
      role: 'Production Manager',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80',
      expertise: 'Event Management',
      achievements: 'Organized 100+ Major Tournaments'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Platform Launch',
      description: 'Started with a vision to revolutionize esports',
      icon: <Sparkles className="h-6 w-6" />
    },
    {
      year: '2021',
      title: 'First Major Tournament',
      description: 'Hosted our first international tournament',
      icon: <Trophy className="h-6 w-6" />
    },
    {
      year: '2022',
      title: 'Community Growth',
      description: 'Reached 50,000 active players',
      icon: <Users className="h-6 w-6" />
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded to 10+ countries',
      icon: <Globe className="h-6 w-6" />
    }
  ];

  const values = [
    {
      title: 'Excellence',
      description: 'We strive for the highest standards in everything we do',
      icon: <Star className="h-6 w-6" />
    },
    {
      title: 'Innovation',
      description: 'Pushing boundaries to create the future of gaming',
      icon: <Zap className="h-6 w-6" />
    },
    {
      title: 'Community',
      description: 'Building a strong, supportive gaming community',
      icon: <Users className="h-6 w-6" />
    },
    {
      title: 'Integrity',
      description: 'Maintaining transparency and fairness in all operations',
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
                <span className="text-indigo-400 font-medium">Our Story</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pb-4">
                  About Exorix
                </span>
                <span className="block text-white mt-2">Gaming Platform</span>
              </h1>
            </FadeInDown>
            
            <FadeIn delay={0.2}>
              <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                We are a passionate team of gamers, developers, and esports enthusiasts dedicated to creating the ultimate gaming experience.
          </p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="relative py-20 bg-gradient-to-b from-[#0A0A0B] to-[#12121A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            <StaggerItem>
              <HoverElevate>
                <div className="p-8 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl bg-indigo-500/20">
                      <Target className="h-6 w-6 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white ml-4">Our Mission</h3>
                  </div>
                  <p className="text-gray-400">
                    To revolutionize the gaming industry by providing an unparalleled platform for competitive gaming and community building.
            </p>
          </div>
              </HoverElevate>
            </StaggerItem>
            
            <StaggerItem delay={0.1}>
              <HoverElevate>
                <div className="p-8 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl bg-purple-500/20">
                      <Users className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white ml-4">Our Vision</h3>
                  </div>
                  <p className="text-gray-400">
                    To become the world's leading esports platform, connecting millions of gamers worldwide through competitive gaming.
            </p>
          </div>
              </HoverElevate>
            </StaggerItem>
            
            <StaggerItem delay={0.2}>
              <HoverElevate>
                <div className="p-8 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl bg-pink-500/20">
                      <Heart className="h-6 w-6 text-pink-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white ml-4">Our Values</h3>
                  </div>
                  <p className="text-gray-400">
                    Excellence, Innovation, Community, and Integrity drive everything we do in the gaming world.
            </p>
          </div>
              </HoverElevate>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>

      {/* Team Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#12121A] to-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                Meet Our Team
              </span>
            </h2>
          </FadeInUp>
          
          <StaggerContainer className="grid md:grid-cols-4 gap-8">
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <HoverScale>
                  <div className="group relative overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50">
                <img
                  src={member.image}
                  alt={member.name}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                      <p className="text-indigo-400 mb-2">{member.role}</p>
                      <p className="text-sm text-gray-400 mb-1">{member.expertise}</p>
                      <p className="text-xs text-gray-500">{member.achievements}</p>
                    </div>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#0A0A0B] to-[#12121A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
                Our Journey
              </span>
            </h2>
          </FadeInUp>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-indigo-500 to-purple-500" />
            
            <StaggerContainer className="space-y-8">
              {milestones.map((milestone, index) => (
                <StaggerItem key={milestone.year} delay={index * 0.1}>
                  <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-1/2 p-4">
                      <HoverElevate>
                        <div className="p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50">
                          <div className="flex items-center mb-4">
                            <div className="p-3 rounded-xl bg-indigo-500/20">
                              {milestone.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white ml-4">{milestone.year}</h3>
                          </div>
                          <h4 className="text-lg font-semibold text-indigo-400 mb-2">{milestone.title}</h4>
                          <p className="text-gray-400">{milestone.description}</p>
                        </div>
                      </HoverElevate>
                    </div>
                    <div className="w-1/2" />
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
                </div>
              </div>

      {/* Values Section */}
      <div className="relative py-20 bg-gradient-to-b from-[#12121A] to-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                Our Core Values
              </span>
            </h2>
          </FadeInUp>
          
          <StaggerContainer className="grid md:grid-cols-4 gap-8">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <HoverScale>
                  <div className="p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-xl bg-indigo-500/20">
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white ml-4">{value.title}</h3>
                    </div>
                    <p className="text-gray-400">{value.description}</p>
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
                  Join Our Journey
                </span>
              </h2>
            </FadeInUp>
            
            <FadeIn delay={0.2}>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
                Be part of the revolution in competitive gaming. Join our community and start your journey today.
              </p>
            </FadeIn>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <FadeInUp delay={0.3}>
                <AnimatedButton>
                  <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(99,102,241,0.3)]">
                    <span className="relative z-10 flex items-center">
                      Join Now
                      <Trophy className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </AnimatedButton>
              </FadeInUp>
              
              <FadeInUp delay={0.4}>
                <AnimatedButton>
                  <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-gray-800/50 text-white backdrop-blur-sm border border-gray-700/50 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-indigo-500/50">
                    Learn More
                    <Gamepad2 className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
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

export default About;