import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  // palette: {
  //   primary: {
  //     main: '#1976d2',
  //   },
  //   secondary: {
  //     main: '#dc004e',
  //   },
  // },

  typography: {
    h1: {
      fontSize: '1.5rem',
      color: 'rgb(25, 118, 210)',
    },
  },
  // components: {
  //   MuiButton: {
  //     styleOverrides: {
  //       root: {
  //         margin: '8px',
  //         padding: '16px',
  //         backgroundColor: 'lightblue',
  //       },
  //     },
  //   },
  // },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
