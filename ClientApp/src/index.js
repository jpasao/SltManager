import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import { tkStore } from './store'

createRoot(document.getElementById('root')).render(
  <Provider store={tkStore}>
    <App />
  </Provider>,
)
