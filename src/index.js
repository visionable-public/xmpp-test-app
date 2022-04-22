import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';

import Amplify from "aws-amplify";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// AWS Config
const REGION = "us-east-1";
const USER_POOL_ID = "us-east-1_ESYPvGhN3";
const USER_POOL_WEB_CLIENT_ID = "5ai2feek1rgpso497om1kbj4ug";

Amplify.configure({
  Auth: {
    region: REGION,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: USER_POOL_WEB_CLIENT_ID,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />

    <Authenticator>
      {({ signOut, user }) => (
        <App signOutAWS={signOut} user={user} />
      )}
    </Authenticator>
  </React.StrictMode>,
  document.getElementById('root')
);
