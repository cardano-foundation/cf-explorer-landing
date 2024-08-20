import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    typography: {
        fontSize: 16,
        fontFamily: ['Chivo', 'sans-serif'].join(','),
        color: '#000000',
        h1: {
            fontSize: '40px',
            fontWeight: 400,
            lineHeight: '48px',
            letterSpacing: '-0.5px',
            textAlign: 'left',
            margin: '3% 0'
        },
        h6: {
            fontSize: '20px',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '-0.5px',
            textAlign: 'left',
            margin: '2% 0'
        },
        body1: {
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '-0.5px',
            textAlign: 'left',
            margin: '6% 0'
        }
    },
});