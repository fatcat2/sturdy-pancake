import './App.css';
import React from 'react';
import Table from './Table';

const App = () => {
  return (
    <div className="flex flex-col">
      <div className="basis-full bg-gray-900 text-white">
        <p className="text-3xl pt-2 pb-2 px-2">pu-salary-guide</p>
      </div>
      <div className="justify-items-center basis-full">
        <Table />
      </div>
    </div>
  );
};

export default App;
