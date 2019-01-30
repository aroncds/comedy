import React from 'react';
import ReactDOM from 'react-dom';
import DrizzleProvider from './util/components/DrizzleProvide';

import App from './App'
import { LoadingContainer } from 'drizzle-react-components'

import drizzle from './drizzle'

import './i18n'

ReactDOM.render((
    <DrizzleProvider drizzle={drizzle}>
      <LoadingContainer>
        <App />
      </LoadingContainer>
    </DrizzleProvider>
  ),
  document.getElementById('root')
);
