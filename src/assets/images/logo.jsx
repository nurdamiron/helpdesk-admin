import React from 'react';
import { Box } from '@mui/material';

const HelpDeskLogo = ({ width = 180, height = 60 }) => {
  // Использование предоставленного изображения логотипа
  return (
    <Box
      component="img"
      src="/helpdesk-logo.png"
      alt="HelpDesk Logo"
      sx={{
        width: width,
        height: height,
        objectFit: 'contain'
      }}
    />
  );
};

export default HelpDeskLogo; 