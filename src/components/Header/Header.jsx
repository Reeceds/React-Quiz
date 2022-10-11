import { React } from "react";
import { useState } from "react";
import "./Header.scss";
import { auth } from "../../config/firebase-config";
import { signOut } from "firebase/auth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

import { Container } from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";

export default function Header({ setIsAuth }) {
    let [burgerBtn, setBurgerBtn] = useState(faBars);
    let navigate = useNavigate();

    // Logs out user
    const logOutUser = () => {
        signOut(auth).then(() => {
            localStorage.clear();
            setIsAuth(false);
            navigate("/login");
        });

        closeMobileNav();
    };

    // Toggle mobile nav
    const toggleMobileNav = () => {
        if (burgerBtn == faBars) {
            openMobileNav();
        } else {
            closeMobileNav();
        }
    };

    // Open mobile nav
    const openMobileNav = () => {
        let mobileMenu = document.querySelector(".js-main-nav_mobile");
        let mobileMenuNav = document.querySelector(".js-main-nav_mobile nav");

        setBurgerBtn(faXmark);

        mobileMenu.style.animation = "navContainerSlideDown 250ms forwards"; // * 'forwards' makes the animation stay where it finishes

        setTimeout(() => {
            mobileMenuNav.classList.remove("hide");
        }, 200);
    };

    // Close mobile nav
    const closeMobileNav = () => {
        let mobileMenu = document.querySelector(".js-main-nav_mobile");
        let mobileMenuNav = document.querySelector(".js-main-nav_mobile nav");

        setBurgerBtn(faBars);

        mobileMenu.style.animation = "navContainerSlideUp 250ms forwards"; // * 'forwards' makes the animation stay where it finishes
        mobileMenuNav.classList.add("hide");
    };

    return (
        <header className="main-nav">
            {/* Dektop nav */}
            <div className="main-nav_desktop">
                <Container>
                    <div className=" main-nav_desktop-container">
                        <Link onClick={() => closeMobileNav()} className="main-nav_desktop-logo" to="/">
                            The Quiz Of Everything
                        </Link>
                        {localStorage.getItem("isAuth") === null ? (
                            <nav>
                                <Link to="/login">Log In</Link>
                            </nav>
                        ) : (
                            <nav>
                                <Link to="/myScores">My Scores</Link>
                                <Link to="/leaderboard">Leaderboards</Link>
                                <Link to="/personalDetails">Personal Details</Link>
                                <span className="main-nav_desktop-seperator">|</span>
                                <span onClick={logOutUser}>Log Out</span>
                            </nav>
                        )}
                        <FontAwesomeIcon
                            onClick={() => toggleMobileNav()}
                            className="js-burger-menu-btn burger-menu-btn"
                            icon={burgerBtn}
                            color="white"
                            size="2x"
                        />
                    </div>
                </Container>
            </div>

            {/* Mobile nav */}
            <div className="main-nav_mobile js-main-nav_mobile">
                <Container>
                    {localStorage.getItem("isAuth") === null ? (
                        <nav className="hide">
                            <Link onClick={() => closeMobileNav()} to="/login">
                                Log In
                            </Link>
                        </nav>
                    ) : (
                        <nav className="hide">
                            <Link onClick={() => closeMobileNav()} to="/myScores">
                                My Scores
                            </Link>
                            <Link onClick={() => closeMobileNav()} to="/leaderboard">
                                Leaderboards
                            </Link>
                            <Link onClick={() => closeMobileNav()} to="/personalDetails">
                                Personal Details
                            </Link>
                            <span onClick={logOutUser}>Log Out</span>
                        </nav>
                    )}
                </Container>
            </div>
        </header>
    );
}
