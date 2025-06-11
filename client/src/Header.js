import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext";

const Header = () => {
    const { user, clearUser } = useUser();
    const [showName, setShowName] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        clearUser();
        navigate("/");
    };

    const handleSearch = (ev) => {
        ev.preventDefault();
        if (showName) {
            navigate(`/searchShow?query=${encodeURIComponent(showName)}`);
            setShowName("");
        }
    };
    return (
        <Nav>
            <NavList>
                <NavItem>
                    <StyledLink to="/">Home</StyledLink>
                </NavItem>
                <NavItem>
                    <SearchForm onSubmit={handleSearch}>
                        <SearchInput
                            type="text"
                            placeholder="Search for a TV show"
                            value={showName}
                            onChange={(ev) => setShowName(ev.target.value)}
                        />
                        <SearchButton type="submit">Search</SearchButton>
                    </SearchForm>
                </NavItem>
                {!user ? (
                    <>
                        <NavItem>
                            <StyledLink to="/signUp">Sign Up</StyledLink>
                        </NavItem>
                        <NavItem>
                            <StyledLink to="/logIn">Login</StyledLink>
                        </NavItem>
                    </>
                ) : (
                    <>
                        <NavItem>
                            <UserText>Welcome, {user.name}!</UserText>
                        </NavItem>
                        <NavItem>
                            <StyledLink to="/watchList">Watchlist</StyledLink>
                        </NavItem>
                        <NavItem>
                            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                        </NavItem>
                    </>
                )}
            </NavList>
        </Nav>
    );
};

export default Header;

const Nav = styled.nav`
    background-color: #282c34;
    padding: 1rem;
`;

const NavList = styled.ul`
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    padding: 0;
`;

const NavItem = styled.li`
    margin: 0 1rem;
`;

const StyledLink = styled(Link)`
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
    &:hover {
        text-decoration: underline;
    }
`;

const SearchForm = styled.form`
    display: flex;
    align-items: center;
`;

const SearchInput = styled.input`
    padding: 0.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
`;

const SearchButton = styled.button`
    background-color: #4caf50;
    color: white;
    padding: 0.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    margin-left: 0.5rem;
    cursor: pointer;
    &:hover {
        background-color: #45a049;
    }
`;

const LogoutButton = styled.button`
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;

const UserText = styled.span`
    color: white;
    font-size: 1.2rem;
`;
