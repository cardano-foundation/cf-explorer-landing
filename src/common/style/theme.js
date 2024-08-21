import { createTheme } from '@mui/material/styles';

const commonTypography = {
    fontSize: 16,
    fontFamily: ['Chivo', 'sans-serif'].join(','),
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
        margin: '6% 0',
        color: 'inherit',
    }
};

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#ffffff',
            paper: '#f5f5f5',
        },
        text: {
            primary: '#000000',
            secondary: '#000000'
        },
    },
    typography: {
        ...commonTypography,
        color: '#000000',
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#242526',
            paper: '#303846',
        },
        text: {
            primary: '#ffffff',
            secondary: '#E3E3E3'
        },
    },
    typography: {
        ...commonTypography,
        color: '#ffffff',
    },
});
