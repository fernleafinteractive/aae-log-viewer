import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import './styles.css'
import {LogDataContextProvider} from "./context/LogDataContext";
import {LogDataMappingContextProvider} from "./context/LogDataMappingContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <LogDataContextProvider>
          <LogDataMappingContextProvider>
            <App />
          </LogDataMappingContextProvider>
      </LogDataContextProvider>
  </React.StrictMode>,
)
