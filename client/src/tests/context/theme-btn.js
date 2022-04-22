import React, {useContext} from 'react';
import {ThemeContext, themes} from "./context";

function ThemeButton() {
    const theme = useContext(ThemeContext);
    const onClick = (themeStyleObj) => {
        // theme: {current: light, set: fn}
        if (theme.current !== themeStyleObj) {
            theme.set({...theme, current: themeStyleObj });
        }
    }
    return (
        <div>
            <button onClick={onClick.bind(null, themes.light)}>Light</button>
            <button onClick={onClick.bind(null, themes.dark)}>Dark</button>
        </div>
    );
}

export default ThemeButton;