import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/NavBar.css'; // Import your CSS file

const NavBar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8000/api/session', { withCredentials: true })
            .then(response => {
                if (response.data.loggedIn) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                    navigate('/login');
                }
            })
            .catch(error => {
                console.error('Error checking session:', error);
            });
    }, [navigate]);

    const logoutHandler = () => {
        axios.post('http://localhost:8000/api/logout', {}, { withCredentials: true })
            .then(response => {
                console.log(response.data);
                setIsLoggedIn(false);
                navigate('/login');
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top">
            <Navbar.Brand>
                <Link to="/reviews">Music Reviewer</Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <NavDropdown title="Menu" id="basic-nav-dropdown">
                        {isLoggedIn && (
                            <NavDropdown.Item href="/reviews/new">+ Add a Review</NavDropdown.Item>
                        )}
                        {isLoggedIn && (
                            <NavDropdown.Item href="/reviews">All Reviews</NavDropdown.Item>
                        )}
                        {isLoggedIn ? (
                            <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                        ) : (
                            <NavDropdown.Item onClick={() => navigate('/login')}>Login</NavDropdown.Item>
                        )}
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavBar;
