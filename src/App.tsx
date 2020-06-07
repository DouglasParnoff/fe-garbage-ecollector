import React, { useState } from 'react';
import './App.css';

import Header from "./Header";

function App() {

  const [counter, setCounter] = useState(0);

  function handleButtonClick(){
    setCounter(counter + 1);
  }

  return (
    <div>
      <Header title="teste2"/>
      <h1>Conteúdo da app</h1>
      <h1>{counter}</h1>
      <h1>{counter * 2}</h1>
      <h1>{counter * 3}</h1>
      <button type="button" onClick={handleButtonClick}>Aumentar</button>
    </div>
  );
}

export default App;
