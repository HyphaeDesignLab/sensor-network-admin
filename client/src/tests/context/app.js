import React, {useState, useEffect} from 'react';
import {ThemeContext, themes} from "./context";
import Toolbar from "./toolbar";

function App() {
    const [theme, setTheme] = useState({
        current: themes.light, // initial default
        set: null
    });

    console.log('app component guts');


    useEffect(() => {
        console.log('app component on theme change useEffect()');
    }, [theme]);

    useEffect(() => {
        console.log('app component on init useEffect()');

        if (!theme.set) {
            setTheme({...theme, set: setTheme});
        }
    }, []);

    return (
        <ThemeContext.Provider value={theme}>
            <Toolbar />
        </ThemeContext.Provider>
    );
}

export default App;
