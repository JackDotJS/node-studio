import { type Component } from 'solid-js';
import "./css/globals.css";
import Header from './components/Header';
import { MemoryProvider } from './MemoryContext';
import PanelHandler from './components/PanelHandler';

const App: Component = () => {

  return (
    <MemoryProvider>

      <Header />
      <PanelHandler />

    </MemoryProvider>
  );
};

export default App;
