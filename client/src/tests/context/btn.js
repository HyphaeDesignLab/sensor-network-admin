import React, {useContext} from 'react';
import {ThemeContext} from "./context";

function ThemedButton() {
    const theme = useContext(ThemeContext);
    return (
        <button style={{ background: theme.current.background, color: theme.current.foreground }}>
            I do something whatever
        </button>
    );
}

export default ThemedButton;