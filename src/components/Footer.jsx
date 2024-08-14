// src/components/Footer.jsx
import React from 'react';
import Box from '@mui/material/Box';

function Footer({ imageUrl }) {
  return (
    <Box
      component="footer"
      sx={{
        height: '100%',
        overflow: 'hidden',
        marginTop: 4, // Space between content and footer
      }}
    >
      <img
        src={imageUrl}
        alt="Footer"
        style={{ width: '100%', height: 'auto' }}
      />
    </Box>
  );
}

export default Footer;
