import React from 'react';
import ThemedButton from "./btn";
import ThemeButton from "./theme-btn";

function Toolbar(props) {
    return (
        <div>
            <ThemedButton />
            <ThemeButton />
        </div>
    );

}

export default Toolbar;