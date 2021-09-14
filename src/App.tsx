import Home from './Home';
import { MeetingProvider, lightTheme } from 'amazon-chime-sdk-component-library-react';

import { ThemeProvider } from 'styled-components';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={lightTheme}>
        <MeetingProvider>
          <Home />
        </MeetingProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
