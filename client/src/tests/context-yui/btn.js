// import React, {useContext} from 'react';
// import {ThemeContext, themes} from "./context";

// function ThemedButton(props) {
//     // const theme = useContext(ThemeContext); // Ivan
//     console.log(context);
//     // let theme = context;
//     return (
//         <button
//         // style={{ background: theme.current.background, color: theme.current.foreground }} // Ivan
//         // style={{backgroundColor: theme.background}}
//             >
//                 {/* {...props} */}
//                 Sup
//         </button>
//     );
// }

// ThemedButton.contextType = ThemeContext;

// export default ThemedButton;



// example from react

import React from 'react';
import {ThemeContext} from './context';

class ThemedButton extends React.Component {
  render() {
    let props = this.props;
    console.log('context:', this.context);
    let theme = this.context.theme || this.context;
    console.log(theme);
    return (
      <button
        {...props}
        style={{backgroundColor: theme.background, color: theme.foreground}}
      />
    );
  }
}
ThemedButton.contextType = ThemeContext;

export default ThemedButton;
