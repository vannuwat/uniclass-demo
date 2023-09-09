import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { ChakraProvider, extendTheme } from '@chakra-ui/react'

// const breakpoints = {
//   base: "0em", // 0px
//   sm: "30em", // ~480px. em is a relative unit and is dependant on the font size.
//   md: "48em", // ~768px
//   lg: "62em", // ~992px
//   xl: "80em", // ~1280px
//   "2xl": "96em", // ~1536px
// };

const breakpoints = {
  base: "0px",
  xs: "575px",
  sm: "730px",
  md: "768px",
  lg: "960px",
  xl: "1230px",
};

const theme = extendTheme({ breakpoints });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
