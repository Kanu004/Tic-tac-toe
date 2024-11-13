import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Computer from './Computer';
import Twoplayers from './Twoplayers';
import img from './th.jpg';
import './styles.scss';


const HomePage = () => {
  return (
    <div className='bg-balls'>
      <div className='app'>
       <h1 className='class'>TIC <span className="text-green">TAC</span> TOE
       </h1> 
       <img src={img} className='btn-reset2'/> 
     
       <div className="app1">
      <Link to="Computer.jsx" >
      <button >Human vs Computer</button>
      </Link>
      <Link to="Twoplayers.jsx" >
      <button>Two players</button>
      </Link>
    </div>
    </div>
    </div>
  );
};

const App = () => {
  return (
    <HashRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="Computer.jsx" element={<Computer />} />
      <Route path="Twoplayers.jsx" element={<Twoplayers />} />
    </Routes>
    </HashRouter>
  );
};

export default App;