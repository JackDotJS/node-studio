import { createSignal, type Component } from 'solid-js';
import "./css/globals.css";
import Header from './components/Header';
import { MemoryProvider } from './MemoryContext';
import Panel from './components/Panel';

const App: Component = () => {

  const [value, setValue] = createSignal(5);

  return (
    <MemoryProvider>


      <Header />
      <Panel>

      </Panel>

    </MemoryProvider>
  );
};

export default App;
