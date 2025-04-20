import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Clock,
  ArrowRight,
  Search,
  Tag,
  Bookmark,
  Share2,
  Heart,
  MessageCircle,
  TrendingUp,
  Flame,
  Target,
  Swords,
  Gamepad,
  Newspaper,
  Laptop,
  Award,
  Headphones,
  Tv,
  Radio,
  Youtube,
  Twitch,
  Filter,
  SlidersHorizontal,
  Layout,
  List
} from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, createBlog } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreateBlogModal from '../components/CreateBlogModal';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: any;
  likes: number;
  comments: number;
  tags?: string[];
}

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateBlogModal, setShowCreateBlogModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Sample featured blogs (these could be fetched from Firestore with a "featured" flag)
  const sampleFeaturedBlogs = [
    {
      id: 'featured1',
      title: 'The Future of Virtual Events: Trends to Watch in 2025',
      excerpt: "Explore the latest innovations in virtual event technology and how they're shaping the future of digital gatherings.",
      content: "Full content here...",
      image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80',
      author: {
        id: 'user1',
        name: 'Sarah Johnson'
      },
      createdAt: { toDate: () => new Date('2025-03-15') },
      likes: 42,
      comments: 12,
      tags: ['Virtual Events', 'Technology', 'Future Trends']
    },
    {
      id: 'featured2',
      title: 'Maximizing Engagement in Live Streaming: Best Practices',
      excerpt: 'Learn how to create engaging live streams that keep your audience coming back for more.',
      content: "Full content here...",
      image: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?auto=format&fit=crop&q=80',
      author: {
        id: 'user2',
        name: 'Michael Chen'
      },
      createdAt: { toDate: () => new Date('2025-03-12') },
      likes: 38,
      comments: 8,
      tags: ['Live Streaming', 'Engagement', 'Content Creation']
    }
  ];

  const categories = [
    { 
      id: 'all', 
      name: 'All Posts', 
      icon: <Gamepad2 className="h-5 w-5" />,
      color: 'from-violet-600 to-indigo-600'
    },
    { 
      id: 'trending', 
      name: 'Trending', 
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'from-rose-600 to-pink-600'
    },
    { 
      id: 'esports', 
      name: 'Esports', 
      icon: <Trophy className="h-5 w-5" />,
      color: 'from-amber-600 to-yellow-600'
    },
    { 
      id: 'tournaments', 
      name: 'Tournaments', 
      icon: <Swords className="h-5 w-5" />,
      color: 'from-emerald-600 to-green-600'
    },
    { 
      id: 'game-reviews', 
      name: 'Game Reviews', 
      icon: <Star className="h-5 w-5" />,
      color: 'from-blue-600 to-cyan-600'
    },
    { 
      id: 'guides', 
      name: 'Guides & Tips', 
      icon: <Target className="h-5 w-5" />,
      color: 'from-purple-600 to-fuchsia-600'
    },
    { 
      id: 'tech', 
      name: 'Gaming Tech', 
      icon: <Laptop className="h-5 w-5" />,
      color: 'from-teal-600 to-emerald-600'
    },
    { 
      id: 'streaming', 
      name: 'Streaming', 
      icon: <Radio className="h-5 w-5" />,
      color: 'from-red-600 to-orange-600'
    },
    { 
      id: 'community', 
      name: 'Community', 
      icon: <Users className="h-5 w-5" />,
      color: 'from-sky-600 to-blue-600'
    }
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        console.log("Starting to fetch blogs...");
        
        // Fetch blogs from Firestore
        const blogsCollection = collection(db, 'blogs');
        console.log("Blogs collection reference created");
        
        const blogsQuery = query(blogsCollection, orderBy('createdAt', 'desc'));
        console.log("Query created with orderBy createdAt desc");
        
        try {
          const blogsSnapshot = await getDocs(blogsQuery);
          console.log(`Fetched ${blogsSnapshot.docs.length} blog documents`);
          
          if (blogsSnapshot.empty) {
            console.log("No blogs found in the database");
            setBlogs([]);
            setFeaturedBlogs(sampleFeaturedBlogs);
            setError(null);
            setLoading(false);
            return;
          }
          
          const blogsData = blogsSnapshot.docs.map(doc => {
            console.log(`Processing blog document: ${doc.id}`);
            const data = doc.data();
            
            // Add defensive checks for required fields
            if (!data.title) console.log(`Blog ${doc.id} is missing title`);
            if (!data.content) console.log(`Blog ${doc.id} is missing content`);
            
            try {
              return {
                id: doc.id,
                title: data.title || "Untitled Blog",
                content: data.content || "",
                excerpt: data.summary || data.excerpt || (data.content ? data.content.substring(0, 150) + '...' : "No content available"),
                image: data.coverImage || data.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80',
                author: {
                  id: data.authorId || "unknown",
                  name: data.authorName || 'Anonymous'
                },
                createdAt: data.createdAt,
                likes: data.likes || 0,
                comments: data.comments || 0,
                tags: data.tags || []
              } as BlogPost;
            } catch (parseError) {
              console.error(`Error parsing blog ${doc.id}:`, parseError);
              return null;
            }
          }).filter(blog => blog !== null) as BlogPost[];
          
          console.log(`Successfully processed ${blogsData.length} blogs`);
          setBlogs(blogsData);
          
          // For now, use sample featured blogs
          // In a real app, you might fetch featured blogs separately or filter them
          setFeaturedBlogs(sampleFeaturedBlogs);
          
          setError(null);
        } catch (queryError: any) {
          console.error("Error executing blogs query:", queryError);
          throw new Error(`Failed to execute query: ${queryError.message}`);
        }
      } catch (err: any) {
        console.error('Error fetching blogs:', err);
        // Provide more specific error message
        if (err.code === 'permission-denied') {
          setError('You do not have permission to access blogs. Please check your account permissions.');
        } else if (err.code === 'unavailable') {
          setError('The blog service is currently unavailable. Please try again later.');
        } else {
          setError(`Failed to load blogs: ${err.message}`);
        }
        
        // Still show featured blogs even if user blogs fail to load
        setBlogs([]);
        setFeaturedBlogs(sampleFeaturedBlogs);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Extract all unique tags from blogs
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    
    // Add tags from featured blogs
    featuredBlogs.forEach(blog => {
      blog.tags?.forEach(tag => tagSet.add(tag));
    });
    
    // Add tags from regular blogs
    blogs.forEach(blog => {
      blog.tags?.forEach(tag => tagSet.add(tag));
    });
    
    return Array.from(tagSet).sort();
  }, [blogs, featuredBlogs]);

  // Filter blogs based on search query and selected tags
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Tag filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => blog.tags?.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  }, [blogs, searchQuery, selectedTags]);

  const handleCreateBlog = async (blogData: any) => {
    try {
      // This function would be implemented in your firebase.ts file
      // Similar to the createEvent function
      const result = await createBlog(blogData);
      
      if (result.success) {
        setShowCreateBlogModal(false);
        // Refresh blogs to show the new one
        window.location.reload();
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      console.error('Error creating blog:', err);
      setError(err.message || 'Failed to create blog');
    }
  };

  const formatDate = (dateObj: any) => {
    if (!dateObj) return 'Date unavailable';
    
    try {
      const date = dateObj.toDate ? dateObj.toDate() : 
                  (dateObj.seconds ? new Date(dateObj.seconds * 1000) : new Date(dateObj));
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Handle search submission
  const handleSearch = useCallback(() => {
    setIsSearching(true);
    // Simulate a small delay to show the loading state
    setTimeout(() => {
      setSearchQuery(searchInputValue.trim());
      setIsSearching(false);
    }, 300);
  }, [searchInputValue]);

  // Clear all filters including search
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSearchInputValue('');
    setSelectedTags([]);
    setIsSearching(false);
  }, []);

  const filteredPosts = blogs.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.tags?.includes(activeCategory);
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-900 dark:text-white">Loading blogs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Enhanced Hero Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 to-purple-900/20" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Gaming Insights & Stories
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              Discover the latest in gaming news, esports updates, expert guides, and community stories.
            </motion.p>
            
            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-8 mt-12"
            >
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-indigo-400" />
                <span className="text-gray-300">500+ Articles</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-purple-400" />
                <span className="text-gray-300">50k+ Readers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-6 w-6 text-pink-400" />
                <span className="text-gray-300">Expert Writers</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Search and Filters */}
        <div className="mb-12 space-y-6">
          {/* Search Bar and View Toggle */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-full bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700/50 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 pl-12"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-all duration-300"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Advanced Filters
              </button>
              <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-600' : 'hover:bg-gray-700/50'}`}
                  title="Grid view"
                  aria-label="Switch to grid view"
                >
                  <Layout className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-600' : 'hover:bg-gray-700/50'}`}
                  title="List view"
                  aria-label="Switch to list view"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Categories Scroll */}
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-4">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r ${category.color} shadow-lg`
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                >
                  {category.icon}
                  <span className="ml-2 whitespace-nowrap">{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      title="Sort posts by"
                      aria-label="Sort posts by"
                    >
                      <option value="latest">Latest</option>
                      <option value="popular">Most Popular</option>
                      <option value="trending">Trending</option>
                    </select>
                  </div>

                  {/* Platform Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Platforms</label>
                    <div className="flex flex-wrap gap-2">
                      {['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile'].map(platform => (
                        <button
                          key={platform}
                          onClick={() => setSelectedPlatforms(prev => 
                            prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
                          )}
                          className={`px-3 py-1 rounded-full text-sm ${
                            selectedPlatforms.includes(platform)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                          }`}
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Genre Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Genres</label>
                    <div className="flex flex-wrap gap-2">
                      {['Action', 'RPG', 'Strategy', 'Sports', 'FPS'].map(genre => (
                        <button
                          key={genre}
                          onClick={() => setSelectedGenres(prev => 
                            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
                          )}
                          className={`px-3 py-1 rounded-full text-sm ${
                            selectedGenres.includes(genre)
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Blog Posts Grid/List */}
        <div className={viewMode === 'grid' ? 
          "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : 
          "space-y-8"
        }>
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`group relative overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50 ${
                viewMode === 'list' ? 'flex gap-6' : ''
              }`}
            >
              <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'aspect-video'} overflow-hidden`}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {post.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={post.author.avatar || 'https://via.placeholder.com/40'}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h4 className="text-white font-medium">{post.author.name}</h4>
                    <p className="text-gray-400 text-sm">{formatDate(post.createdAt)}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {getReadTime(post.content)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center hover:text-indigo-400 transition-colors" title="Share post" aria-label="Share this post">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ x: 5 }}
                  className="mt-4 flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Enhanced Newsletter Section */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30 rounded-3xl" />
          <div className="relative p-12 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold mb-8"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Join Our Gaming Community
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto mb-12"
            >
              Get exclusive gaming content, early access to articles, and special community perks.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-6 py-4 rounded-full bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700/50 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium transition-all duration-300 hover:shadow-[0_0_40px_8px_rgba(99,102,241,0.3)]"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Blog Modal */}
      <CreateBlogModal
        isOpen={showCreateBlogModal}
        onClose={() => setShowCreateBlogModal(false)}
        onSubmit={handleCreateBlog}
      />
    </div>
  );
};

export default Blog;