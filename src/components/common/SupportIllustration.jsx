import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { 
  HeadsetIcon, 
  MessageCircleIcon, 
  ClockIcon, 
  CheckCircleIcon,
  SettingsIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  ZapIcon
} from 'lucide-react';

const SupportIllustration = ({ width = 400, height = 400 }) => {
  const { t } = useTranslation(['common']);
  
  return (
    <Box
      sx={{
        width: width,
        height: height,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      }}
    >
      {/* Background circles */}
      <Box
        sx={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          top: '-50px',
          right: '-50px',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          bottom: '-30px',
          left: '-30px',
          animation: 'float 4s ease-in-out infinite reverse',
        }}
      />

      {/* Main content container */}
      <Box
        sx={{
          position: 'relative',
          textAlign: 'center',
          color: 'white',
          zIndex: 2,
        }}
      >
        {/* Central support icon */}
        <Box
          sx={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.08)' },
            },
          }}
        >
          <HeadsetIcon size={50} color="white" />
        </Box>
        {/* Floating service icons - much more spaced */}
        {/* Message icon - top left far */}
        <Box
          sx={{
            position: 'absolute',
            top: '-15px',
            left: '-15px',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(34, 197, 94, 0.7))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)',
            border: '2px solid rgba(255,255,255,0.3)',
            animation: 'bounce 3s ease-in-out infinite',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-8px)' },
            },
          }}
        >
          <MessageCircleIcon size={22} color="white" />
        </Box>

        {/* Clock icon - top right far */}
        <Box
          sx={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(59, 130, 246, 0.7))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
            border: '2px solid rgba(255,255,255,0.3)',
            animation: 'bounce 3s ease-in-out infinite 1s',
          }}
        >
          <ClockIcon size={22} color="white" />
        </Box>

        {/* Check icon - bottom left far */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '-15px',
            left: '-15px',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(16, 185, 129, 0.7))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
            border: '2px solid rgba(255,255,255,0.3)',
            animation: 'bounce 3s ease-in-out infinite 2s',
          }}
        >
          <CheckCircleIcon size={22} color="white" />
        </Box>

        {/* Settings icon - bottom right far */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '-15px',
            right: '-15px',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.9), rgba(168, 85, 247, 0.7))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3)',
            border: '2px solid rgba(255,255,255,0.3)',
            animation: 'rotate 8s linear infinite',
            '@keyframes rotate': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        >
          <SettingsIcon size={22} color="white" />
        </Box>

        {/* Email icon - far left */}
        <Box
          sx={{
            position: 'absolute',
            top: '35%',
            left: '-40px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(239, 68, 68, 0.7))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
            border: '2px solid rgba(255,255,255,0.3)',
            transform: 'translateY(-50%)',
            animation: 'bounce 3s ease-in-out infinite 0.5s',
          }}
        >
          <MailIcon size={18} color="white" />
        </Box>

        {/* Phone icon - far right */}
        <Box
          sx={{
            position: 'absolute',
            top: '35%',
            right: '-40px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(245, 158, 11, 0.7))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
            border: '2px solid rgba(255,255,255,0.3)',
            transform: 'translateY(-50%)',
            animation: 'bounce 3s ease-in-out infinite 1.5s',
          }}
        >
          <PhoneIcon size={18} color="white" />
        </Box>


        {/* Minimal decorative dots */}
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.5)',
              top: `${35 + Math.sin(i * 2.1) * 30}%`,
              left: `${35 + Math.cos(i * 2.1) * 30}%`,
              animation: `twinkle ${2.5 + i * 0.5}s ease-in-out infinite ${i * 0.8}s`,
              '@keyframes twinkle': {
                '0%, 100%': { opacity: 0.2, transform: 'scale(0.5)' },
                '50%': { opacity: 0.8, transform: 'scale(1.2)' },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SupportIllustration;