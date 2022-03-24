import './partials/_global.scss';
import Quiz from './pages/Quiz';
import Header from './components/Header';
import LogIn from './pages/LogIn';

import { useState, useEffect } from 'react';

import { Container } from 'react-bootstrap';

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


function App() {

  const [isAuth, setIsAuth] = useState(false);

  return(
    <Router>
      <Header setIsAuth={setIsAuth} />
      <Container>
        <Routes>
          <Route path='/' element={<Quiz />}/>
          <Route path='/login' element={<LogIn setIsAuth={setIsAuth} />}/>
        </Routes>
      </Container>
    </Router>
  )
}

export default App;

