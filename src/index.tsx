import { render } from 'solid-js/web';
import { attachDevtoolsOverlay } from "@solid-devtools/overlay";

attachDevtoolsOverlay({
  defaultOpen: false
})

import App from './app';

render(() => <App />, document.body);