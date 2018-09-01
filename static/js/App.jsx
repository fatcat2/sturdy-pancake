import React from 'react';
import Button from '@material/react-button/dist'; // /index.js is implied

//import '@material/react-button/dist/button.css';
import '@material/react-button/dist/button.css';
class App extends React.Component {
   render() {
       return (
             <div>
                     <Button>
                               Click Me!
                     </Button>
             </div>
       );
    }
}
export default App;
