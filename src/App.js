import './partials/_global.scss';
import Quiz from './pages/Quiz';
import Header from './components/Header';
import LogIn from './pages/LogIn';
import PersonalDetails from './pages/PersonalDetails';
import MyScores from './pages/MyScores';
import Leaderboard from './pages/Leaderboard';

import { useState, useEffect } from 'react';

import { Container } from 'react-bootstrap';

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


function App() {

    const [isAuth, setIsAuth] = useState(false);

    return(
        <Router>
            <Header setIsAuth={setIsAuth} />
            <Container className='main-section'>
                <Routes>
                    <Route path='/' element={<Quiz />}/>
                    <Route path='/login' element={<LogIn setIsAuth={setIsAuth} />}/>
                    <Route path='/personalDetails' element={<PersonalDetails />}/>
                    <Route path='/myScores' element={<MyScores />}/>
                    <Route path='/leaderboard' element={<Leaderboard />}/>
                </Routes>
            </Container>
        </Router>
    )
}

export default App;

