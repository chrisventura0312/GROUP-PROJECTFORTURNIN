/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
//import './css/LoginReg.css';
import './css/styles.css';
import './css/NavBar.css';

import NavBar from "./NavBar";

const LoginReg = () => {
    const navigate = useNavigate();

    // For logging in
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [logError, setLogError] = useState("");
    const [userId, setUserId] = useState("");
    // For registering
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [regError, setRegError] = useState([]);
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:8000/api/login", 
                { userName, password },
                { withCredentials: true } // Send cookies along with the request
            );
            console.log(response.data); // Log the response
            // Handle successful login, such as storing session information
            console.log("Logged in successfully", response.data);
            setUserId(response.data.userId); // Save the userId in the state
            navigate("/reviews"); // Navigate to the dashboard after successful login
        }
        catch (error) {
            // Handle login error
            if (error?.response?.data?.error) {
                setLogError(error.response.data.error);
            } else {
                setLogError("An error occurred while logging in.");
            }
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("Registering...");
        console.log("Username:", registerUsername);
        console.log("Email:", registerEmail);
        console.log("Password:", registerPassword);
        console.log("Confirmed Password:", confirmPassword);

        try {
        const response = await axios.post("http://localhost:8000/api/register", {
            userName: registerUsername,
            email: registerEmail,
            password: registerPassword,
            confirmPassword: confirmPassword,
        }, 
        {withCredentials: true } // Send cookies along with the request
        );
        // Handle successful registration
        console.log("Registered successfully", response.data);
        navigate("/reviews"); // Navigate to the dashboard after successful registration
        } catch (error) { 
            // Handle registration error
            if (error.response.data.error) {
                const errorMessage = error.response.data.error;
                let validationMessages;
                if (Array.isArray(errorMessage)) {
                    validationMessages = errorMessage;
                } else {
                    validationMessages = [errorMessage];
                }
                setRegError(validationMessages);
                console.log("ERROR:", validationMessages);
            } else {
                setRegError(["An error occurred while registering."]);
                console.log("ERROR:", error);
            }
            console.log("Error:", error);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="text-center my-4">
    <h1>Welcome!</h1>
    <p>
        Start your music review journey with us here at insert title.<br />
        Log your favorite songs and artists and share your thoughts with the world!<br />
        Let your voice be heard, and let the music play on!
    </p>
</div>


            <div className="row justify-content-center">
                <div className="col-md-6">
                    {/* Registration Form Card */}
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Register</h2>
                            {regError && regError.map((error, index) => (
                                <p key={index} style={{ color: "red", marginBottom: "10px" }}>
                                    {error}
                                </p>
                            ))}
                            <form onSubmit={handleRegister}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Username"
                                        value={registerUsername}
                                        onChange={(e) => setRegisterUsername(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <button
                                    style={{ backgroundColor: "green", color: "white" }}
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Register
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    {/* Login Form Card */}
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Login</h2>
                            {logError && <p style={{ color: "red" }}>{logError}</p>}
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Username"
                                        value={userName}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button
                                    style={{ backgroundColor: "green", color: "white" }}
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    
};

export default LoginReg;