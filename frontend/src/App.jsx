import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { AppProvider } from './context/AppContext';
import { theme } from './theme/theme';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Router from './components/Router';
import Modals from './components/common/Modals';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Box sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: 'background.default'
        }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Router />
          </Box>
          <Footer />
          <Modals />
        </Box>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;