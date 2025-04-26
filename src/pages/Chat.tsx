import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { generateResponse } from '../utils/groqClient';
import { 
  Send, 
  Users, 
  Gamepad2, 
  Trophy, 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  X, 
  Image, 
  Smile, 
  Mic, 
  MoreVertical,
  Crown,
  Shield,
  Star,
  Bell,
  Volume2,
  VolumeX,
  ThumbsUp,
  Heart,
  PartyPopper,
  Flag,
  Settings,
  HelpCircle,
  Info,
  Gift,
  Calendar,
  Award,
  Zap,
  Sparkles,
  Bot,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, where, getDocs, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';
import { User } from 'firebase/auth';

interface FirebaseUser extends User {
  displayName: string | null;
  photoURL: string | null;
}

interface Message {
  id: string;
  text: string;
  userId: string;
  username: string;
  userAvatar?: string;
  timestamp: any;
  game?: string;
  isAdmin?: boolean;
  isModerator?: boolean;
  isPremium?: boolean;
  reactions?: { [key: string]: string[] };
  isPinned?: boolean;
  isAnnouncement?: boolean;
  isAI?: boolean;
  isTyping?: boolean;
  isReply?: boolean;
  replyTo?: { messageId: string; username: string; text: string };
}

interface Channel {
  id: string;
  name: string;
  description: string;
  icon: string;
  isPrivate: boolean;
  members: number;
  isRules?: boolean;
}

interface GameStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'in-game';
  currentGame?: string;
  rank?: string;
  level?: number;
  lastActive?: any;
}

interface TopPlayer {
  id: number;
  name: string;
  points: number;
  avatar: string;
  rank?: string;
}

const formatMessageText = (text: string) => {
  // First split by double asterisks
  const boldParts = text.split(/(\*\*.*?\*\*)/g);
  
  return boldParts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Handle bold text
      return <span key={`bold-${index}`} className="font-bold">{part.slice(2, -2)}</span>;
    } else {
      // Handle bullet points for remaining text
      const bulletParts = part.split(/\n\*(.*)/g).filter(Boolean);
      if (bulletParts.length > 1) {
        return (
          <React.Fragment key={`bullet-${index}`}>
            {bulletParts.map((bulletPart, bulletIndex) => {
              if (bulletIndex === 0 && !part.startsWith('\n*')) {
                // First part before any bullets
                return <span key={`text-${bulletIndex}`}>{bulletPart}</span>;
              }
              // Bullet points
              return (
                <div key={`bullet-item-${bulletIndex}`} className="flex items-start space-x-2 ml-2 mt-1">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>{bulletPart.trim()}</span>
                </div>
              );
            })}
          </React.Fragment>
        );
      }
      // Regular text
      return part;
    }
  });
};

const Chat = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const firebaseUser = user as FirebaseUser;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoadingChannels, setIsLoadingChannels] = useState(true);
  const [activeChannel, setActiveChannel] = useState<string>('rules');
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showGameStatus, setShowGameStatus] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    id: user?.uid || '',
    name: user?.email?.split('@')[0] || 'Player',
    status: 'online',
    currentGame: 'Valorant',
    rank: 'Diamond',
    level: 42,
    lastActive: new Date()
  });
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showGameSelector, setShowGameSelector] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>('Valorant');
  const [games] = useState<string[]>([
    'Valorant', 'CS:GO', 'League of Legends', 'Fortnite', 'Apex Legends', 
    'Overwatch', 'Dota 2', 'PUBG', 'Rocket League', 'Minecraft'
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [topPlayers] = useState<TopPlayer[]>([
    { 
      id: 1, 
      name: 'Player1', 
      points: 1250,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1',
      rank: 'Diamond'
    },
    { 
      id: 2, 
      name: 'Player2', 
      points: 980,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player2',
      rank: 'Platinum'
    },
    { 
      id: 3, 
      name: 'Player3', 
      points: 875,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player3',
      rank: 'Gold'
    },
    { 
      id: 4, 
      name: 'Player4', 
      points: 760,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player4',
      rank: 'Silver'
    },
    { 
      id: 5, 
      name: 'Player5', 
      points: 650,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player5',
      rank: 'Bronze'
    }
  ]);
  const [aiTypingText, setAiTypingText] = useState<string>('');
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const typingSpeed = 30; // milliseconds per character
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showMessageMenu, setShowMessageMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  // Update AI avatar constant with a more reliable URL
  const AI_AVATAR_URL = "https://api.dicebear.com/7.x/bottts/svg?seed=exorix-ai&backgroundColor=2563eb&eyes=happy&mouth=smile&face=round&scale=95&radius=10";

  // Add fallback avatar handling
  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://api.dicebear.com/7.x/bottts/svg?seed=fallback";
  };

  // Add state to track if current user is admin
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);

  // Check admin status on mount or when user changes
  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        setIsCurrentUserAdmin(await isUserAdmin(user.uid));
      } else {
        setIsCurrentUserAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  // Redirect to general channel if no channel is selected
  useEffect(() => {
    if (!channelId) {
      navigate('/chat/general');
    }
  }, [channelId, navigate]);

  // Enhanced scroll to bottom function
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // Always scroll on initial load or if near bottom or AI is typing
      const shouldScroll = isInitialLoad || 
        isGeneratingResponse || 
        container.scrollHeight - container.scrollTop - container.clientHeight < 200;
      
      if (shouldScroll) {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: isInitialLoad ? 'auto' : behavior,
          block: 'end'
        });
      }
    }
  };

  // Auto scroll on new messages or typing updates
  useEffect(() => {
    if (isGeneratingResponse || aiTypingText) {
      scrollToBottom('auto');
    } else {
      scrollToBottom('smooth');
    }
  }, [messages, aiTypingText, isGeneratingResponse]);

  // Fetch channels from Firestore
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channelsRef = collection(db, 'channels');
        const channelsSnapshot = await getDocs(channelsRef);
        
        if (channelsSnapshot.empty) {
          // Initialize default channels if none exist
          const defaultChannels = [
            { id: 'rules', name: 'Rules & Announcements', description: 'Community guidelines and important updates', icon: '📢', isPrivate: false, members: 0, isRules: true },
            { id: 'general', name: 'General', description: 'General gaming discussion', icon: '🎮', isPrivate: false, members: 0 },
            { id: 'esports', name: 'Esports', description: 'Competitive gaming and tournaments', icon: '🏆', isPrivate: false, members: 0 },
            { id: 'monad', name: 'Monad Network', description: 'NFT and blockchain gaming', icon: '💎', isPrivate: false, members: 0 },
            { id: 'base', name: 'Base Track', description: 'Base Track gaming community', icon: '🚀', isPrivate: false, members: 0 },
            { id: 'tournaments', name: 'Tournaments', description: 'Tournament announcements and results', icon: '🎯', isPrivate: false, members: 0 },
            { id: 'team-finder', name: 'Team Finder', description: 'Find teammates for your favorite games', icon: '👥', isPrivate: false, members: 0 },
            { id: 'game-lfg', name: 'Game LFG', description: 'Looking for group in specific games', icon: '🎲', isPrivate: false, members: 0 },
            { id: 'trading', name: 'Trading', description: 'Trade in-game items and NFTs', icon: '🔄', isPrivate: false, members: 0 },
          ];

          // Create each default channel in Firestore
          for (const channel of defaultChannels) {
            await addDoc(collection(db, 'channels'), channel);
          }

          setChannels(defaultChannels);
        } else {
          const channelsData = channelsSnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          })) as Channel[];
          setChannels(channelsData);
        }
        setIsLoadingChannels(false);
      } catch (error) {
        console.error('Error fetching channels:', error);
        toast.error('Failed to load channels');
        setIsLoadingChannels(false);
      }
    };

    fetchChannels();
  }, []);

  // Update real-time message listener
  useEffect(() => {
    if (!channelId || !user) return;

    const messagesRef = collection(db, 'channels', channelId, 'messages');
    const q = query(
      messagesRef,
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages: Message[] = [];
      
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const messageData = {
            id: change.doc.id,
            ...change.doc.data()
          } as Message;
          newMessages.push(messageData);
        }
      });

      setMessages((prevMessages) => {
        const messageMap = new Map();
        [...prevMessages, ...newMessages].forEach((msg) => {
          messageMap.set(msg.id, msg);
        });
        return Array.from(messageMap.values()).sort((a, b) => {
          const timeA = a.timestamp?.seconds || 0;
          const timeB = b.timestamp?.seconds || 0;
          return timeA - timeB;
        });
      });

      if (isInitialLoad) {
        setTimeout(() => {
          scrollToBottom('auto');
          setIsInitialLoad(false);
        }, 100);
      }
    });

    return () => {
      unsubscribe();
      setIsInitialLoad(true);
    };
  }, [channelId, user]);

  // Filter messages based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter(message => 
        message.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  }, [searchQuery, messages]);

  // Simulate online users count
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 100) + 50);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setIsEmojiPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to simulate typing animation with real-time scrolling
  const simulateTyping = async (text: string) => {
    setIsGeneratingResponse(true);
    let currentText = '';
    
    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      setAiTypingText(currentText);
      // Scroll to bottom immediately after each character
      setTimeout(() => scrollToBottom('auto'), 0);
      await new Promise(resolve => setTimeout(resolve, typingSpeed));
    }
    
    setIsGeneratingResponse(false);
    setAiTypingText('');
    return text;
  };

  // Add admin check function
  const isUserAdmin = async (userId: string) => {
    if (!userId) return false;
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      return userDoc.exists() && userDoc.data()?.isAdmin === true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Update handleSendMessage to check for admin privileges
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !newMessage.trim() || !channelId) return;

    // Check if it's the rules channel and user is not an admin
    if (channelId === 'rules') {
      const isAdmin = await isUserAdmin(firebaseUser.uid);
      if (!isAdmin) {
        toast.error('Only administrators can post in the Rules & Announcements channel');
        return;
      }
    }

    const messageText = newMessage.trim();
    const isAIQuery = messageText.toLowerCase().startsWith('@exorix');
    
    try {
      setNewMessage('');
      const now = new Date();
      const userMessageData = {
        text: messageText,
        userId: firebaseUser.uid,
        username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Anonymous',
        userAvatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
        timestamp: serverTimestamp(),
        localTimestamp: now.getTime(),
        channel: channelId,
        isAdmin: false,
        isModerator: false,
        reactions: {},
        isPinned: false,
        isAnnouncement: false,
        isAI: false
      };

      // Add message to channel's messages subcollection
      await addDoc(collection(db, 'channels', channelId, 'messages'), userMessageData);

      if (isAIQuery) {
        const aiQuery = messageText.substring(7).trim();
        
        try {
          const aiResponse = await generateResponse(aiQuery, 'en');
          
          const aiMessageData = {
            text: aiResponse,
            userId: 'ai',
            username: 'Exorix AI',
            userAvatar: AI_AVATAR_URL,
            timestamp: serverTimestamp(),
            localTimestamp: Date.now(),
            channel: channelId,
            isAdmin: true,
            isModerator: true,
            reactions: {},
            isPinned: false,
            isAnnouncement: false,
            isAI: true
          };

          await addDoc(collection(db, 'channels', channelId, 'messages'), aiMessageData);
        } catch (error) {
          console.error('Error getting AI response:', error);
          toast.error('Failed to get AI response. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      setNewMessage(messageText);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Image uploaded successfully!');
    }, 1500);
  };

  const handleChannelChange = (channelId: string) => {
    setActiveChannel(channelId);
    setSearchQuery('');
  };

  const toggleVoiceChat = () => {
    setIsVoiceChatActive(!isVoiceChatActive);
    if (!isVoiceChatActive) {
      toast.success('Voice chat activated!');
    } else {
      toast.success('Voice chat deactivated');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.success(isMuted ? 'Unmuted' : 'Muted');
  };

  const toggleGameStatus = () => {
    setShowGameStatus(!showGameStatus);
  };

  const updateGameStatus = (game: string) => {
    setSelectedGame(game);
    setGameStatus({
      ...gameStatus,
      currentGame: game,
      status: 'in-game',
      lastActive: new Date()
    });
    setShowGameSelector(false);
    toast.success(`Now playing: ${game}`);
  };

  // Update handleReaction to use subcollection
  const handleReaction = async (messageId: string, reaction: string) => {
    if (!user || !channelId) return;
    
    try {
      const messageRef = doc(db, 'channels', channelId, 'messages', messageId);
      const message = messages.find(m => m.id === messageId);
      
      if (!message) return;
      
      const reactions = message.reactions || {};
      const userReactions = reactions[reaction] || [];
      
      if (userReactions.includes(user.uid)) {
        reactions[reaction] = userReactions.filter(id => id !== user.uid);
      } else {
        reactions[reaction] = [...userReactions, user.uid];
      }
      
      await updateDoc(messageRef, { reactions });
      setShowReactions(null);
    } catch (error) {
      console.error('Error updating reaction:', error);
      toast.error('Failed to update reaction');
    }
  };

  const getReactionCount = (message: Message, reaction: string) => {
    return message.reactions?.[reaction]?.length || 0;
  };

  const hasUserReacted = (message: Message, reaction: string) => {
    if (!user || !message.reactions?.[reaction]) return false;
    return message.reactions[reaction].includes(user.uid);
  };

  const getChannelIcon = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    return channel?.icon || '💬';
  };

  const getChannelName = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    return channel?.name || 'Unknown Channel';
  };

  const getChannelDescription = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    return channel?.description || '';
  };

  const isRulesChannel = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    return channel?.isRules || false;
  };

  const renderEmojiPicker = () => {
    if (!isEmojiPickerOpen) return null;
    
    const emojis = ['👍', '❤️', '🎮', '🏆', '🔥', '💯', '👏', '🎉', '🤔', '😎', '💪', '🌟'];
    
    return (
      <div 
        ref={emojiPickerRef}
        className="absolute bottom-16 left-0 bg-gray-800 rounded-lg shadow-lg p-2 z-10"
      >
        <div className="grid grid-cols-6 gap-1">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded"
              onClick={() => {
                setNewMessage(prev => prev + emoji);
                setIsEmojiPickerOpen(false);
              }}
              title={`Add ${emoji} emoji`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderGameSelector = () => {
    if (!showGameSelector) return null;
    
    return (
      <div className="absolute top-16 right-0 bg-gray-800 rounded-lg shadow-lg p-2 z-10 w-48">
        <div className="text-sm font-medium text-white mb-2">Select Game</div>
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {games.map((game) => (
            <button
              key={game}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white flex items-center"
              onClick={() => updateGameStatus(game)}
              title={`Set status to playing ${game}`}
            >
              <Gamepad2 className="w-4 h-4 mr-2 text-indigo-400" />
              {game}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderReactionPicker = (messageId: string) => {
    if (showReactions !== messageId) return null;
    
    const reactions = ['👍', '❤️', '🎮', '🏆', '🔥', '💯'];
    
    return (
      <div className="absolute bottom-8 left-0 bg-gray-800 rounded-lg shadow-lg p-2 z-10">
        <div className="flex space-x-1">
          {reactions.map((reaction) => (
            <button
              key={reaction}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded"
              onClick={() => handleReaction(messageId, reaction)}
              title={`React with ${reaction}`}
            >
              {reaction}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderGameStatus = () => {
    if (!showGameStatus) return null;
    
    return (
      <div className="absolute top-16 right-0 bg-gray-800 rounded-lg shadow-lg p-3 z-10 w-64">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-bold text-white">Game Status</div>
          <button 
            onClick={toggleGameStatus}
            className="text-gray-400 hover:text-white"
            title="Close game status"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              gameStatus.status === 'online' ? 'bg-green-500' : 
              gameStatus.status === 'in-game' ? 'bg-blue-500' : 'bg-gray-500'
            }`}></div>
            <span className="text-sm text-gray-300">{gameStatus.name}</span>
          </div>
          <div className="flex items-center">
            <Gamepad2 className="w-4 h-4 mr-2 text-indigo-400" />
            <span className="text-sm text-gray-300">{gameStatus.currentGame}</span>
          </div>
          {gameStatus.rank && (
            <div className="flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
              <span className="text-sm text-gray-300">{gameStatus.rank}</span>
            </div>
          )}
          {gameStatus.level && (
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-2 text-purple-500" />
              <span className="text-sm text-gray-300">Level {gameStatus.level}</span>
            </div>
          )}
          <button
            className="w-full mt-2 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
            onClick={() => setShowGameSelector(true)}
            title="Change game"
          >
            Change Game
          </button>
        </div>
      </div>
    );
  };

  // --- Add handler for double-click on message ---
  const handleMessageDoubleClick = (e: React.MouseEvent, message: Message) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setSelectedMessage(message);
    setShowMessageMenu(true);
  };

  // --- Add handler for emoji reaction ---
  const handleAddReaction = async (emoji: string) => {
    if (!selectedMessage || !channelId || !user) return;
    try {
      const messageRef = doc(db, 'channels', channelId, 'messages', selectedMessage.id);
      const messageDoc = await getDoc(messageRef);
      if (messageDoc.exists()) {
        const currentReactions = messageDoc.data().reactions || {};
        const userList = currentReactions[emoji] || [];
        let newList;
        if (userList.includes(user.uid)) {
          newList = userList.filter((id: string) => id !== user.uid);
        } else {
          newList = [...userList, user.uid];
        }
        await updateDoc(messageRef, {
          reactions: {
            ...currentReactions,
            [emoji]: newList
          }
        });
        toast.success('Reaction updated!');
      }
    } catch (error) {
      toast.error('Failed to update reaction');
    }
    setShowMessageMenu(false);
  };

  // --- Add handler for delete ---
  const handleDeleteMessage = async () => {
    if (!selectedMessage || !channelId || !user) return;
    if (!(selectedMessage.userId === user.uid || (await isUserAdmin(user.uid)))) {
      toast.error('You can only delete your own messages.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'channels', channelId, 'messages', selectedMessage.id));
      // Optimistically remove from local state
      setMessages((prev) => prev.filter((msg) => msg.id !== selectedMessage.id));
      toast.success('Message deleted!');
    } catch (error) {
      toast.error('Failed to delete message');
    }
    setShowMessageMenu(false);
  };

  // --- Add handler for reply ---
  const handleReply = async () => {
    if (!replyToMessage || !channelId || !user || !replyText.trim()) return;
    try {
      await addDoc(collection(db, 'channels', channelId, 'messages'), {
        text: replyText,
        userId: user.uid,
        username: firebaseUser.displayName || user.email?.split('@')[0] || 'Anonymous',
        userAvatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
        timestamp: serverTimestamp(),
        isReply: true,
        replyTo: {
          messageId: replyToMessage.id,
          username: replyToMessage.username,
          text: replyToMessage.text
        }
      });
      setReplyText('');
      setReplyToMessage(null);
      toast.success('Reply sent!');
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  // --- Add click outside handler for menu ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menuElement = document.querySelector('.message-menu');
      if (showMessageMenu && menuElement && !menuElement.contains(e.target as Node)) {
        setShowMessageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMessageMenu]);

  // --- Prevent body scroll when menu is open ---
  useEffect(() => {
    if (showMessageMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showMessageMenu]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0B] via-[#1F1F23] to-[#0A0A0B] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-5rem)]">
          {/* Channel Navigation Sidebar */}
          <div className="w-full md:w-64 bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800/50 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-800/50">
              <h2 className="text-xl font-bold text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-indigo-400" />
                Channels
              </h2>
              <p className="text-sm text-gray-400 mt-1">Select a channel to join</p>
            </div>

            {/* Channel List */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {channels.map((channel) => (
                  <Link
                    key={channel.id}
                    to={`/chat/${channel.id}`}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      channelId === channel.id
                        ? 'bg-indigo-600/20 text-indigo-400'
                        : 'text-gray-300 hover:bg-gray-800/50'
                    }`}
                  >
                    <span className="mr-2">{channel.icon}</span>
                    <span className="flex-1">{channel.name}</span>
                    {channel.members > 0 && (
                      <span className="text-xs text-gray-500">{channel.members}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Online Users Count */}
            <div className="p-4 border-t border-gray-800/50">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-400">{onlineUsers} online</span>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800/50 overflow-hidden flex flex-col">
            {/* Channel Header */}
            {channelId && (
              <div className="p-4 border-b border-gray-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <span className="mr-2">{getChannelIcon(channelId)}</span>
                      {getChannelName(channelId)}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {getChannelDescription(channelId)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white"
                      onClick={() => setShowNotifications(!showNotifications)}
                      title="Notifications"
                    >
                      <Bell className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white"
                      onClick={() => setShowFilters(!showFilters)}
                      title="Filter Messages"
                    >
                      <Filter className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white"
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      title="More Options"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Rules section for the Rules channel */}
                {channelId === 'rules' && (
                  <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <h3 className="text-lg font-medium text-white mb-3">Community Guidelines</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-indigo-400" />
                        Be respectful to all members
                      </li>
                      <li className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-indigo-400" />
                        No spam or excessive self-promotion
                      </li>
                      <li className="flex items-center">
                        <Gamepad2 className="w-4 h-4 mr-2 text-indigo-400" />
                        Keep discussions gaming-related
                      </li>
                      <li className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-indigo-400" />
                        No harassment or toxic behavior
                      </li>
                      <li className="flex items-center">
                        <Flag className="w-4 h-4 mr-2 text-indigo-400" />
                        Report any violations to moderators
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mb-4 text-gray-600" />
                  <p className="text-lg">No messages yet</p>
                  <p className="text-sm">Be the first to start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      layout
                      onDoubleClick={(e) => handleMessageDoubleClick(e, message)}
                      className={`flex items-start space-x-3 group relative ${message.isAI ? 'bg-gray-800/30 rounded-lg p-4 border border-gray-700/50' : ''} cursor-pointer hover:bg-gray-700/70 transition-colors`}
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                          message.isAI ? 'bg-indigo-600/20 border-2 border-indigo-500/50' : 'bg-gray-800'
                        }`}>
                          {message.userAvatar ? (
                            <img 
                              src={message.userAvatar} 
                              alt={message.username}
                              className="w-full h-full object-cover"
                              onError={handleAvatarError}
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-lg font-bold text-indigo-400">
                              {message.username.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${message.isAI ? 'text-indigo-400' : 'text-white'}`}>
                            {message.username}
                          </span>
                          {message.isAI && !message.isTyping && (
                            <div className="flex items-center px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs">
                              <Bot className="w-3 h-3 mr-1" />
                              AI
                            </div>
                          )}
                          {message.isAdmin && !message.isAI && (
                            <Crown className="w-4 h-4 text-yellow-500" aria-label="Admin" />
                          )}
                          {message.isModerator && !message.isAI && (
                            <Shield className="w-4 h-4 text-blue-500" aria-label="Moderator" />
                          )}
                          <span className="text-xs text-gray-500">
                            {message.timestamp?.toDate ? new Date(message.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </span>
                        </div>
                        
                        <div className={`mt-1 ${message.isAI ? 'text-gray-300 space-y-2' : 'text-gray-300'}`}>
                          {message.isTyping ? (
                            <div>
                              {aiTypingText || (
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                              )}
                            </div>
                          ) : (
                            formatMessageText(message.text)
                          )}
                        </div>
                      </div>
                      {message.isReply && message.replyTo && (
                        <div className="text-xs text-gray-400 mb-1">
                          Replying to {message.replyTo.username || 'Unknown User'}: {message.replyTo.text}
                        </div>
                      )}
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} className="h-0" />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-800">
              {channelId === 'rules' ? (
                <div className="flex items-center justify-center p-4 bg-gray-800/30 rounded-lg">
                  <Shield className="w-5 h-5 text-indigo-400 mr-2" />
                  <span className="text-gray-400">Only administrators can post in this channel</span>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
                    title="Attach file"
                    aria-label="Attach file"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*"
                    aria-label="File upload"
                  />
                  
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Message input"
                    />
                    <button
                      type="button"
                      onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-300 transition-colors"
                      title="Add emoji"
                      aria-label="Add emoji"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                    {isEmojiPickerOpen && (
                      <div
                        ref={emojiPickerRef}
                        className="absolute bottom-full right-0 mb-2 p-2 bg-gray-800 rounded-lg shadow-lg"
                        role="dialog"
                        aria-label="Emoji picker"
                      >
                        <div className="grid grid-cols-8 gap-1">
                          {['😊', '😂', '❤️', '👍', '🎮', '🏆', '🎯', '🚀'].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => {
                                setNewMessage(prev => prev + emoji);
                                setIsEmojiPickerOpen(false);
                              }}
                              className="p-1 hover:bg-gray-700 rounded"
                              aria-label={`Add ${emoji} emoji`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Send message"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleVoiceChat}
                    className={`p-2 rounded-lg transition-colors ${
                      isVoiceChatActive 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                    title={isVoiceChatActive ? 'End voice chat' : 'Start voice chat'}
                    aria-label={isVoiceChatActive ? 'End voice chat' : 'Start voice chat'}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Online Users Sidebar */}
          <div className="hidden lg:block w-64 bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800/50 overflow-hidden">
            <div className="p-4 border-b border-gray-800/50">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-indigo-400" />
                Online Users
              </h3>
              <p className="text-sm text-gray-400 mt-1">{onlineUsers} gamers online</p>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-400">Top Players</h4>
                <Trophy className="w-4 h-4 text-yellow-500" />
              </div>
              <LayoutGroup>
                <motion.div layout className="space-y-3">
                  {topPlayers
                    .sort((a, b) => b.points - a.points)
                    .map((player, index) => (
                      <motion.div
                        layout
                        key={player.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/30 transition-colors group"
                      >
                        <motion.div 
                          layout
                          className="relative"
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                            <img 
                              src={player.avatar} 
                              alt={player.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <motion.div
                            layout
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white"
                          >
                            {index + 1}
                          </motion.div>
                        </motion.div>
                        <motion.div layout className="flex-1">
                          <motion.div layout className="flex items-center">
                            <p className="text-sm font-medium text-white">{player.name}</p>
                            <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-gray-800/50 text-gray-400">
                              {player.rank}
                            </span>
                          </motion.div>
                          <motion.div 
                            layout
                            className="flex items-center"
                          >
                            <motion.p
                              key={player.points}
                              initial={{ scale: 1.2, color: '#818CF8' }}
                              animate={{ scale: 1, color: '#9CA3AF' }}
                              className="text-xs text-gray-400"
                            >
                              {player.points.toLocaleString()} points
                            </motion.p>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {index === 0 && <Crown className="w-3 h-3 text-yellow-500" />}
                              {index === 1 && <Award className="w-3 h-3 text-gray-400" />}
                              {index === 2 && <Award className="w-3 h-3 text-amber-700" />}
                            </motion.div>
                          </motion.div>
                        </motion.div>
                        <motion.div 
                          layout
                          className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          #{index + 1}
                        </motion.div>
                      </motion.div>
                    ))}
                </motion.div>
              </LayoutGroup>
            </div>
            <div className="p-4 border-t border-gray-800/50">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Active Tournaments</h4>
              <div className="space-y-2">
                {['Valorant', 'CS:GO', 'League of Legends', 'Fortnite'].map((game) => (
                  <div key={game} className="flex items-center justify-between p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center">
                      <Gamepad2 className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-sm text-white">{game}</span>
                    </div>
                    <span className="text-xs text-gray-500">{Math.floor(Math.random() * 10) + 5} teams</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-800/50">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Upcoming Events</h4>
              <div className="space-y-2">
                {[
                  { name: 'Summer Gaming Festival', date: 'Jun 15', icon: '🎮' },
                  { name: 'NFT Trading Event', date: 'Jun 20', icon: '💎' },
                  { name: 'Esports Championship', date: 'Jul 5', icon: '🏆' },
                ].map((event) => (
                  <div key={event.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center">
                      <span className="mr-2">{event.icon}</span>
                      <span className="text-sm text-white">{event.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{event.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game Status Panel */}
      {renderGameStatus()}
      
      {/* Game Selector */}
      {renderGameSelector()}
      
      {/* Voice Chat Controls */}
      {isVoiceChatActive && (
        <div className="fixed bottom-4 right-4 bg-gray-800 rounded-lg shadow-lg p-3 flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-white">Voice Chat Active</span>
          </div>
          <button
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white"
            onClick={toggleVoiceChat}
            title="End voice chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-20 flex flex-col space-y-2">
        <button
          className="p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors"
          onClick={toggleGameStatus}
          title="Game Status"
        >
          <Gamepad2 className="w-5 h-5" />
        </button>
        <button
          className="p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors"
          onClick={toggleVoiceChat}
          title="Voice Chat"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {/* Message Interaction Menu */}
      {showMessageMenu && selectedMessage && (
        <div
          className="fixed bg-gray-800 rounded-lg shadow-lg p-2 z-50 message-menu"
          style={{
            top: `${menuPosition.y}px`,
            left: `${menuPosition.x}px`,
            transform: 'translate(-50%, -50%)',
            minWidth: '200px'
          }}
        >
          <div className="flex flex-wrap gap-2 mb-2">
            {EMOJI_OPTIONS.map(emoji => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddReaction(emoji);
                }}
                className="text-xl hover:scale-110 transition-transform p-1"
                title={`React with ${emoji}`}
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setReplyToMessage(selectedMessage);
                setShowMessageMenu(false);
              }}
              className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded flex items-center gap-2"
              title="Reply to message"
              aria-label="Reply to message"
            >
              <MessageSquare className="w-4 h-4" />
              Reply
            </button>
            {(selectedMessage.userId === user?.uid || isCurrentUserAdmin) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMessage();
                }}
                className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded text-red-400 flex items-center gap-2"
                title="Delete message"
                aria-label="Delete message"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reply Input */}
      {replyToMessage && (
        <div className="mt-4 bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Replying to {replyToMessage.username || 'Unknown User'}
            </span>
            <button
              onClick={() => setReplyToMessage(null)}
              className="text-gray-400 hover:text-white"
              title="Cancel reply"
              aria-label="Cancel reply"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2"
              aria-label="Reply text input"
            />
            <button
              onClick={handleReply}
              disabled={!replyText.trim()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              title="Send reply"
              aria-label="Send reply"
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat; 