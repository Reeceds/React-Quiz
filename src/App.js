import "./partials/_global.scss";
import Quiz from "./pages/Quiz/Quiz";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LogIn from "./pages/Login/LogIn";
import PersonalDetails from "./pages/PersonalDetails/PersonalDetails";
import MyScores from "./pages/MyScores/MyScores";
import Leaderboard from "./pages/Leaderboard/Leaderboard";

import { useState, useEffect } from "react";

import { Container } from "react-bootstrap";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
    const [isAuth, setIsAuth] = useState(false);

    return (
        <>
            <div className="static-background"> </div>
            <Router>
                <Header setIsAuth={setIsAuth} />
                <Container className="main-section">
                    <Routes>
                        <Route path="/" element={<Quiz />} />
                        <Route path="/login" element={<LogIn setIsAuth={setIsAuth} />} />
                        <Route path="/personalDetails" element={<PersonalDetails />} />
                        <Route path="/myScores" element={<MyScores />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                    </Routes>
                </Container>
                {/* <Footer /> */}
            </Router>
        </>
    );
}

export default App;
