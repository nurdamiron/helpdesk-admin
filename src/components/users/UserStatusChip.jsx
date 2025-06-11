import React from 'react';
import { Chip, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CheckCircle as ActiveIcon, Cancel as InactiveIcon } from '@mui/icons-material';

/**
 * Component to display user active status
 * 
 * @param {boolean} isActive - User active status
 * @param {string} size - Chip size (small or medium)
 * @returns {JSX.Element}
 */
const UserStatusChip = ({ isActive, size = 'small' }) => {
  const { t } = useTranslation(['users']);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Adjust size for small screens
  const chipSize = isSmallScreen ? 'small' : size;
  
  return isActive ? (
    <Chip
      icon={<ActiveIcon fontSize="small" />}
      label={isSmallScreen ? '' : t('users:active', 'Активный')}
      color="success"
      size={chipSize}
      sx={{ 
        '& .MuiChip-icon': { color: 'inherit' },
        '& .MuiChip-label': { color: 'white' },
        minWidth: isSmallScreen ? '32px' : 'auto',
        height: isSmallScreen ? '24px' : 'auto'
      }}
    />
  ) : (
    <Chip
      icon={<InactiveIcon fontSize="small" />}
      label={isSmallScreen ? '' : t('users:inactive', 'Неактивный')}
      color="error"
      size={chipSize}
      sx={{ 
        '& .MuiChip-icon': { color: 'inherit' },
        '& .MuiChip-label': { color: 'white' },
        minWidth: isSmallScreen ? '32px' : 'auto',
        height: isSmallScreen ? '24px' : 'auto'
      }}
    />
  );
};

export default UserStatusChip;