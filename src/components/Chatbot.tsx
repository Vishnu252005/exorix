import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { MessageCircle, Send, X, Bot, Maximize2, Minimize2, Globe, Mic, MicOff, Volume2, 
  ThumbsUp, ThumbsDown, Search, Download, Gamepad } from 'lucide-react';
import { generateResponse, SUPPORTED_LANGUAGES } from '../utils/groqClient';

// Chatbot component
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sender: string;
  text: string;
  timestamp: number;
  reactions: {
    likes: number;
    dislikes: number;
  };
  gameStats?: {
    game: string;
    stats: {
      [key: string]: string | number;
    };
  };
  clipUrl?: string;
  imageUrl?: string;
}

interface Reaction {
  messageId: string;
  type: 'like' | 'dislike';
}

interface GameConfig {
  name: string;
  icon: string;
  quickReplies: string[];
  defaultMessage: string;
}

const GAME_CONFIGS: { [key: string]: GameConfig } = {
  valorant: {
    name: 'VALORANT',
    icon: '🎯',
    quickReplies: [
      "🎮 Show upcoming Valorant events",
      "💡 Pro gaming tips & strategies",
      "🏆 Latest tournaments & matches",
      "⚔️ Current meta analysis"
    ],
    defaultMessage: "I can help you with Valorant strategies, agent picks, tournament updates, and gameplay tips. What would you like to know?"
  },
  minecraft: {
    name: 'Minecraft',
    icon: '⛏️',
    quickReplies: [
      "🏗️ Building tips & designs",
      "⚔️ Combat & survival guides",
      "🔮 Crafting recipes",
      "🌍 World exploration tips"
    ],
    defaultMessage: "I can help you with Minecraft building designs, crafting recipes, survival strategies, and redstone mechanics. What would you like to explore?"
  }
};

// Add this function before the Chatbot component
const formatMessageText = (text: string) => {
  // Split by double asterisks for bold text
  const boldParts = text.split(/(\*\*.*?\*\*)/g);
  
  return boldParts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Handle bold text
      return <span key={`bold-${index}`} className="font-bold text-lg mb-2">{part.slice(2, -2)}</span>;
    } else {
      // Handle sections and bullet points
      const sections = part.split(/\n(?=[A-Za-z].*:)/g).filter(Boolean);
      
      if (sections.length > 1) {
        return (
          <div key={`section-${index}`} className="space-y-4">
            {sections.map((section, sectionIndex) => {
              const [title, ...content] = section.split('\n');
              return (
                <div key={`section-content-${sectionIndex}`} className="mb-3">
                  {/* Section Title */}
                  <h3 className="text-indigo-400 font-semibold mb-2">{title}</h3>
                  {/* Section Content */}
                  <div className="pl-4 space-y-2">
                    {content.map((line, lineIndex) => {
                      if (line.trim().startsWith('•')) {
                        return (
                          <div key={`bullet-${lineIndex}`} className="flex items-start space-x-2">
                            <span className="text-indigo-400 mt-1">•</span>
                            <span className="flex-1">{line.slice(1).trim()}</span>
                          </div>
                        );
                      }
                      return <p key={`text-${lineIndex}`} className="text-gray-300">{line}</p>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
      
      // Handle single bullet points
      const bulletParts = part.split(/\n•/g).filter(Boolean);
      if (bulletParts.length > 1) {
        return (
          <div key={`bullet-group-${index}`} className="space-y-2 pl-4">
            {bulletParts.map((bulletPart, bulletIndex) => {
              if (bulletIndex === 0 && !part.startsWith('\n•')) {
                return <p key={`text-${bulletIndex}`}>{bulletPart}</p>;
              }
              return (
                <div key={`bullet-item-${bulletIndex}`} className="flex items-start space-x-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span className="flex-1">{bulletPart.trim()}</span>
                </div>
              );
            })}
          </div>
        );
      }
      // Regular text
      return <p key={`text-${index}`}>{part}</p>;
    }
  });
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: '0',
    role: 'assistant' as const,
    content: `**Welcome to Exorix Gaming!**

Gaming Features:
• Share your game stats and achievements
• Upload gameplay clips and screenshots
• Get real-time tournament updates
• Find gaming buddies
• Track your progress
• Get pro gaming tips

How can I assist you with gaming today?`,
    sender: 'bot',
    text: `**Welcome to Exorix Gaming!**

Gaming Features:
• Share your game stats and achievements
• Upload gameplay clips and screenshots
• Get real-time tournament updates
• Find gaming buddies
• Track your progress
• Get pro gaming tips

How can I assist you with gaming today?`,
    timestamp: Date.now(),
    reactions: { likes: 0, dislikes: 0 }
  }]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  // Additional states
  const [userReactions, setUserReactions] = useState<Reaction[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedGame, setSelectedGame] = useState('valorant');

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Clear unread notification when chat is opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
    }
  }, [isOpen]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        setInput("Listening...");
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        
        let errorMessage = '';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech was detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone was found. Ensure it is plugged in and allowed.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission was denied. Please allow access to use this feature.';
            break;
          default:
            errorMessage = 'An error occurred with the speech recognition.';
        }
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: errorMessage,
          sender: 'bot',
          text: errorMessage,
          timestamp: Date.now(),
          reactions: { likes: 0, dislikes: 0 }
        }]);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        if (input === "Listening...") {
          setInput("");
        }
        // Auto-send message if we have valid input
        if (input && input !== "Listening...") {
          handleSendMessage();
        }
      };
    }
  }, [selectedLanguage]); // Re-initialize when language changes

  // Add text-to-speech function
  const speakText = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };
  }, []);

  // Update game selection with context
  const handleGameChange = (game: string) => {
    setSelectedGame(game);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: GAME_CONFIGS[game].defaultMessage,
      sender: 'bot',
      text: GAME_CONFIGS[game].defaultMessage,
      timestamp: Date.now(),
      reactions: { likes: 0, dislikes: 0 }
    }]);
  };

  // Get current game config
  const currentGameConfig = GAME_CONFIGS[selectedGame];

  // Use game-specific quick replies
  const quickReplies = currentGameConfig.quickReplies;

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      const errorMessage = 'Speech recognition is not supported in your browser. Please try Chrome or Edge.';
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: errorMessage,
        sender: 'bot',
        text: errorMessage,
        timestamp: Date.now(),
        reactions: { likes: 0, dislikes: 0 }
      }]);
      return;
    }

    if (!isRecording) {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
      setInput(prev => prev === "Listening..." ? "" : prev);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user' as const,
      content: userMessage,
      sender: 'user',
      text: userMessage,
      timestamp: Date.now(),
      reactions: { likes: 0, dislikes: 0 }
    }]);
    
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse(userMessage, selectedLanguage);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response,
        sender: 'bot',
        text: response,
        timestamp: Date.now(),
        reactions: { likes: 0, dislikes: 0 }
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
        reactions: { likes: 0, dislikes: 0 }
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  // Handle clicks outside of language menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle message reactions
  const handleReaction = (messageId: string, type: 'like' | 'dislike') => {
    const existingReaction = userReactions.find(r => r.messageId === messageId);
    
    if (existingReaction && existingReaction.type === type) {
      // Remove reaction
      setUserReactions(prev => prev.filter(r => r.messageId !== messageId));
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: {
              ...msg.reactions,
              likes: type === 'like' ? Math.max(0, msg.reactions.likes - 1) : msg.reactions.likes,
              dislikes: type === 'dislike' ? Math.max(0, msg.reactions.dislikes - 1) : msg.reactions.dislikes
            }
          };
        }
        return msg;
      }));
    } else {
      // Add/change reaction
      setUserReactions(prev => [
        ...prev.filter(r => r.messageId !== messageId),
        { messageId, type }
      ]);
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: {
              ...msg.reactions,
              likes: type === 'like' ? msg.reactions.likes + 1 : msg.reactions.likes,
              dislikes: type === 'dislike' ? msg.reactions.dislikes + 1 : msg.reactions.dislikes
            }
          };
        }
        return msg;
      }));
    }
  };

  // Save conversation
  const saveConversation = () => {
    const conversation = JSON.stringify(messages, null, 2);
    const blob = new Blob([conversation], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter messages based on search
  const filteredMessages = searchQuery
    ? messages.filter(msg => 
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  return (
    <div className={`fixed z-50 ${isMaximized ? 'inset-4' : 'bottom-6 right-6'}`}>
      {/* Chat button */}
      {!isOpen && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-110"
            aria-label="Open chat"
          >
            <div className="flex flex-col items-center justify-center">
              <MessageCircle className="h-7 w-7" />
              <span className="text-xs font-medium mt-0.5">Chat</span>
            </div>
            
            {/* Notification badge */}
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white ring-2 ring-white animate-bounce">
                1
              </span>
            )}
          </button>
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <div 
          className={`flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in-up transition-all duration-300 ${
            isMaximized 
              ? 'w-full h-full' 
              : 'w-96 h-[32rem]'
          }`}
        >
          {/* Chat header with added features */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
            <div className="flex items-center">
              <div className="relative">
                <Bot className="h-6 w-6 mr-2" />
                <span className="absolute bottom-0 right-1 h-2 w-2 rounded-full bg-green-400 ring-1 ring-white"></span>
              </div>
              <div>
                <h3 className="font-medium">Exorix Assistant</h3>
                <p className="text-[10px] text-indigo-200">Powered by Groq ⚡</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Search messages"
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                onClick={saveConversation}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Save conversation"
              >
                <Download className="h-4 w-4" />
              </button>
              {/* Language Selector */}
              <div className="relative" ref={languageMenuRef}>
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors flex items-center space-x-1"
                  aria-label="Select language"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">{SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.code.toUpperCase()}</span>
                </button>
                
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-32 rounded-lg bg-gray-800/95 backdrop-blur-md shadow-xl border border-gray-700/50 py-1 z-50">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm ${
                          selectedLanguage === lang.code
                            ? 'text-indigo-400 bg-gray-700/50'
                            : 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700/50'
                        } transition-colors`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={toggleMaximize}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label={isMaximized ? "Minimize chat" : "Maximize chat"}
              >
                {isMaximized ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </button>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setIsMaximized(false); // Reset maximized state when closing
                }}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          {showSearch && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Chat messages with reactions */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {filteredMessages.map((message) => (
              <div key={message.id} className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[80%]">
                  <div className={`rounded-lg px-4 py-2 shadow-sm ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                  }`}>
                    {formatMessageText(message.text)}
                    <div className="mt-2 text-xs flex items-center justify-between">
                      <span className={message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'}>
                        {formatTime(new Date(message.timestamp))}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleReaction(message.id, 'like')}
                          className={`p-1 rounded hover:bg-gray-700/30 ${
                            userReactions.find(r => r.messageId === message.id && r.type === 'like')
                              ? 'text-green-400'
                              : 'text-gray-400'
                          }`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          {message.reactions?.likes > 0 && (
                            <span className="ml-1 text-xs">{message.reactions.likes}</span>
                          )}
                        </button>
                        <button
                          onClick={() => handleReaction(message.id, 'dislike')}
                          className={`p-1 rounded hover:bg-gray-700/30 ${
                            userReactions.find(r => r.messageId === message.id && r.type === 'dislike')
                              ? 'text-red-400'
                              : 'text-gray-400'
                          }`}
                        >
                          <ThumbsDown className="h-3 w-3" />
                          {message.reactions?.dislikes > 0 && (
                            <span className="ml-1 text-xs">{message.reactions.dislikes}</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2 mb-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => setInput(reply)}
                  className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 px-3 py-1.5 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800/60 transition-colors font-medium"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced chat input */}
          <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 mb-2">
                <button
                  type="button"
                  onClick={() => handleGameChange(selectedGame === 'valorant' ? 'minecraft' : 'valorant')}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
                  aria-label={`Switch to ${selectedGame === 'valorant' ? 'Minecraft' : 'VALORANT'}`}
                  title={`Switch to ${selectedGame === 'valorant' ? 'Minecraft' : 'VALORANT'}`}
                >
                  <Gamepad className="h-5 w-5" />
                  <span className="text-xs ml-2 font-medium">
                    {currentGameConfig.icon} {currentGameConfig.name}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`p-2 rounded-lg transition-colors ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-label={isRecording ? "Stop recording" : "Start recording"}
                  title={isRecording ? "Stop recording" : "Start recording"}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isRecording ? "Recording... Click mic to stop" : "Type your message..."}
                  className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200"
                  disabled={isRecording}
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50"
                  disabled={!input.trim() || isRecording}
                  aria-label="Send message"
                  title="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Text-to-Speech Button */}
            {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && (
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => speakText(messages[messages.length - 1].text)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    isSpeaking
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/60'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <Volume2 className="h-4 w-4" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4" />
                      <span>Read</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Add TypeScript declaration for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default Chatbot; 