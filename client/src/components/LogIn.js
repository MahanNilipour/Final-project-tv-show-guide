import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const LogIn = () => {
    const { setUserData } = useUser();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogIn = async (ev) => {
        ev.preventDefault();
        try {
            const response = await fetch("/logIn", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, name }),
            });
            const data = await response.json();
            if (response.ok && data.user) {
                setUserData(data.user);
                setError("");
                navigate("/");
            } else {
                setError(data.error || "Login failed.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <LoginWrapper>
            <LoginForm onSubmit={handleLogIn}>
                <h2>Log In</h2>
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    required
                />
                <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    required
                />
                <SubmitButton type="submit">Log In</SubmitButton>
                {error && <ErrorText>{error}</ErrorText>}
            </LoginForm>
        </LoginWrapper>
    );
};

export default LogIn;

const LoginWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f7f7f7;
`;

const LoginForm = styled.form`
    background-color: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;

    h2 {
        font-size: 24px;
        margin-bottom: 20px;
        color: #333;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 16px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;

    &:focus {
        border-color: #4caf50;
        outline: none;
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 0.8rem;
    font-size: 1.2rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #45a049;
    }
`;

const ErrorText = styled.p`
    color: red;
    margin-top: 12px;
    font-size: 14px;
`;
