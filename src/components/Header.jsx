import { React } from 'react';
import { auth } from '../config/firebase-config';
import { signOut } from "firebase/auth";

import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

import { Link, useNavigate } from "react-router-dom";

export default function Header({ setIsAuth }) {

    let navigate = useNavigate();

    // Logs out user
    const logOutUser = () => {
        signOut(auth)
        .then(() => {
            localStorage.clear();
            setIsAuth(false);
            navigate('/login');
        });
    };
  
    return (

        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to='/'>Quiz</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {localStorage.getItem('isAuth') === null
                        ?
                        <Nav.Link as={Link} to='/login'>Log In</Nav.Link>
                        :
                        <NavDropdown title="My Account" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to='/personalDetails'>Personal Details</NavDropdown.Item>
                            <NavDropdown.Item href="#">My Scores</NavDropdown.Item>
                            <NavDropdown.Item href="#">Leaderboard</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={logOutUser} className='js-logout'>Log Out</NavDropdown.Item>
                        </NavDropdown>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    )
}
