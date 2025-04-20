import React from 'react';

interface ProfileAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ name, size = 'md', className = '' }) => {
  // Function to generate a consistent color based on name
  const getColorFromName = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    
    // Generate a number from the name
    const charCodes = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[charCodes % colors.length];
  };

  // Get first letter of the name
  const initial = name.charAt(0).toUpperCase();
  
  // Get background color
  const bgColor = getColorFromName(name);

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-24 h-24 text-3xl',
    xl: 'w-32 h-32 text-4xl'
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${bgColor}
        rounded-full
        flex
        items-center
        justify-center
        text-white
        font-semibold
        ${className}
      `}
    >
      {initial}
    </div>
  );
};

export default ProfileAvatar; 