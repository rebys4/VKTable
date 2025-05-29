import React from 'react';
import './App.css';
import MainTable from './components/MainTable/MainTable';
import CreateForm from './components/CreateForm/createForm';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>База данных</h1>
      <CreateForm />
      <MainTable />
    </div>
  );
}

export default App;
