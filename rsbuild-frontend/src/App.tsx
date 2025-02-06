import './App.css';
import React from 'react';
import Table from './Table';
import { Menu } from './Menu';

const App = () => {
  return (
    <div className="flex flex-col justify-items-center">
      <Menu />
      <div className="flex-row justify-items-center mt-4 basis-5/6">
        <p className="text-5xl font-semibold ">Purdue Salary Guide for 2024</p>
      </div>
      <div className="justify-items-center basis-full">
        <Table />
      </div>
    </div>
  );
};

export default App;
