import React, {useState, useEffect} from 'react';
import {ThemeContext, themes} from "./context";
import Toolbar from "./toolbar";
import ThemedButton from './btn';

function App() {
    const [theme, setTheme] = useState({
        theme: themes.light, // initial default
        set: null
    });
    // const [theme, setTheme] = useState(themes.light);

    // useEffect(() => {
    //     if (!theme.set) {
    //         setTheme({...theme, set: setTheme});
    //     }
    // }, []); // Ivan

    const toggleTheme = () => {
        // console.log('theme:', theme);
        // console.log('theme.theme:', theme.theme);
        // console.log('dark:', themes.dark);
        // console.log('light:', themes.light);
        setTheme(() => ({

            // theme: themes.dark
            theme:
                theme.theme === themes.dark ? themes.light : themes.dark
        }));
    };

    return (
        <div>
            <ThemeContext.Provider
            value={theme}
            >
                <Toolbar changeTheme={toggleTheme}/>
            </ThemeContext.Provider>
            <div>
                <ThemedButton />
            </div>
        </div>
    );
}

export default App;


// example from react

// import React from 'react';
// import {ThemeContext, themes} from './context';
// import Toolbar from './toolbar'
// import ThemedButton from './btn';

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       theme: themes.light,
//     };

//     this.toggleTheme = () => {
//       this.setState(state => ({
//         theme:
//           state.theme === themes.dark
//             ? themes.light
//             : themes.dark,
//       }));
//     };
//   }

//   render() {
//     return (
//       <div>
//         <ThemeContext.Provider value={this.state.theme}>
//           <Toolbar changeTheme={this.toggleTheme} />
//         </ThemeContext.Provider>
//         <div>
//           <ThemedButton />
//         </div>
//       </div>
//     );
//   }
// }

// export default App;