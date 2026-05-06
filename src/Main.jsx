import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import './styles.css'
import {LogDataContextProvider} from "./context/LogDataContext";
import {LogDataMappingContextProvider} from "./context/LogDataMappingContext";
import {TaskGraphContextProvider} from "./context/TaskGraphContext";
import {SelectedTaskIDContextProvider} from "./context/SelectedTaskIDContext";
import {ViewContextProvider} from "./context/ViewContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ViewContextProvider>
          <SelectedTaskIDContextProvider>
              <LogDataContextProvider>
                  <LogDataMappingContextProvider>
                      <TaskGraphContextProvider>
                          <App />
                      </TaskGraphContextProvider>
                  </LogDataMappingContextProvider>
              </LogDataContextProvider>
          </SelectedTaskIDContextProvider>
      </ViewContextProvider>
  </React.StrictMode>,
)
