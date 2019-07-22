import React from 'react';
import * as Sentry from '@sentry/browser';
import { render } from 'react-dom';
import './index.css';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store'

Sentry.init({dsn: "https://cca26849347f4796902414c664f0116f@sentry.io/1510471"});

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                <App />
            </div>
        </ConnectedRouter>
    </Provider>, 
    document.getElementById('root')
);
//registerServiceWorker();
