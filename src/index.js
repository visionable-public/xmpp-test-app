import React, { useState, useEffect, createContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';

import Amplify from "aws-amplify";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const Context = createContext({});

const hostname = "saas.visionable.one";

const AppContainer = () => {
  const [config, setConfig] = useState(null);

  const configure = async () => {
    const json = await getServiceConfig(hostname)

    Amplify.configure({
      Auth: {
        region: json['aws-region'],
        userPoolId: json['aws-user-pool-id'],
        userPoolWebClientId: json['aws-user-pool-client-id'],
      },
    });

    setConfig(json);
  };

  useEffect(() => configure(), []);

  const value = {};

  return !config
    ? null
    : (
      <Context.Provider value={value}>
        <Authenticator>
          {({ signOut, user }) => (
            <App signOutAWS={signOut} user={user} />
          )}
        </Authenticator>
      </Context.Provider>
    );
};

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <AppContainer />
  </React.StrictMode>,
  document.getElementById('root')
);

async function getServiceConfig(hostname) {
  try {
    const res = await fetch(`https://${hostname}/config.json`, { mode: "cors" });
    return await res.json();
  } catch(e) {
    console.log(e);
    alert("Error requesting configuration data for this service");
  }
}
