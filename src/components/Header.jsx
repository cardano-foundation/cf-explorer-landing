// src/components/Header.jsx
import React from 'react';
import Box from '@mui/material/Box';

function Header({ imageUrl }) {
  return (
    <Box
      component="header"
      sx={{
        width: '100%',
        overflow: 'hidden',
        marginBottom: 4, // Space between header and content
      }}
    >
      <img
        src={imageUrl}
        alt="Header"
        style={{ width: '100%', height: 'auto' }}
      />
    </Box>
  );
}

export default Header;