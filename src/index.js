import React from 'react';
import ReactDOM from 'react-dom';
import { DrizzleProvider } from 'drizzle-react'

import App from './App'
import { LoadingContainer } from 'drizzle-react-components'

import { store } from './store'
import drizzleOptions from './drizzleOptions'

ReactDOM.render((
    <DrizzleProvider options={drizzleOptions} store={store}>
      <LoadingContainer>
        <App />
      </LoadingContainer>
    </DrizzleProvider>
  ),
  document.getElementById('root')
);
