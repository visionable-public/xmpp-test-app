import React, { useState, useEffect, createContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';

import Amplify from "aws-amplify";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const Context = createContext({});

const HOSTNAME_KEY = "visionable-xmpp-hostname";
const lastHostname = localStorage.getItem(HOSTNAME_KEY);
const hostname = lastHostname || prompt("Enter hostname", "saas.visionable.one");
localStorage.setItem(HOSTNAME_KEY, hostname);

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

  const value = {
    HOSTNAME_KEY
  };

  return !config
    ? null
    : (
      <Context.Provider value={value}>
        <Authenticator
          components={{
            Header() {
              return (
                <div style={{ textAlign: "center", marginBottom: "2em" }}>
                  <img
                    alt="Visionable logo"
                    style={{ maxWidth: "300px" }}
                    src="https://v3.visionable.io/images/visionable-logo.svg" />
                </div>
              );
            }
          }}
          signUpAttributes={[
            'family_name',
            'given_name',
            'updated_at',
          ]}
          loginMechanisms={['email']}
        >
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
    localStorage.removeItem(HOSTNAME_KEY);
    window.location.reload();
  }
}
