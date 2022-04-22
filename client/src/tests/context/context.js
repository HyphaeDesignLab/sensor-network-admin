import React from 'react';

export const themes = {
    light: {
        id: 'light',
        foreground: "#000000",
        background: "#eeeeee"
    },
    dark: {
        id: 'dark',
        foreground: "#ffffff",
        background: "#222222"
    }
};

export const ThemeContext = React.createContext({});