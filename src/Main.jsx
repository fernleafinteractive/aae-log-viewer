import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import './styles.css'
import {LogDataContextProvider} from "./context/LogDataContext";
import {LogDataMappingContextProvider} from "./context/LogDataMappingContext";
import {TaskGraphContextProvider} from "./context/TaskGraphContext";
import {FileInputWorkerContextProvider} from "./context/FileInputWorkerContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
          <LogDataContextProvider>
              <LogDataMappingContextProvider>
                  <TaskGraphContextProvider>
                      <FileInputWorkerContextProvider>
                        <App />
                      </FileInputWorkerContextProvider>
                  </TaskGraphContextProvider>
              </LogDataMappingContextProvider>
          </LogDataContextProvider>
  </React.StrictMode>,
)
