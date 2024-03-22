import { type Component } from 'solid-js';
import "./css/globals.css";
import Header from './components/Header';
import { MemoryProvider } from './MemoryContext';

const App: Component = () => {

  return (
    <MemoryProvider>
      <Header />
      Sample Text
    </MemoryProvider>
  );
};

export default App;
