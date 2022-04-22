import React from 'react';
import ThemedButton from "./btn";
// import ThemeButton from "./theme-btn";

function Toolbar(props) {
    return (
        <ThemedButton onClick={props.changeTheme}>
            Change Theme
        </ThemedButton>
    );

}

export default Toolbar;



// example from react

// import React from 'react';
// import ThemedButton from './btn';

// // An intermediate component that uses the ThemedButton
// function Toolbar(props) {
//     return (
//       <ThemedButton onClick={props.changeTheme}>
//         Change Theme
//       </ThemedButton>
//     );
//   }

// export default Toolbar;