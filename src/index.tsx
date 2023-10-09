import { render } from 'solid-js/web';

import App from './app';

const root = document.getElementById('root');

if (!(root instanceof HTMLElement)) {
  throw new Error(`Root element not found.`);
}

render(() => <App />, root);