import React, {useContext} from 'react';
import {ThemeContext, themes} from "./context";

function ThemeButton() {
    // const theme = useContext(ThemeContext); // Ivan
    // const onClick = (themeType) => {
    //     // theme: {current: light, set: fn}
    //     theme.set({...theme, current: themeType}); // Ivan
    // }
    return (
        <div>
            <button
            // onClick={onClick.bind(null, themes.light)} // Ivan
            >Light</button>
            <button
            // onClick={onClick.bind(null, themes.dark)} // Ivan
            >Dark</button>
        </div>
    );
}

export default ThemeButton;