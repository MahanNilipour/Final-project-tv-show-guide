import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import Header from "./Header";
import SearchShow from "./components/SearchShow"; 
import ShowDetails from "./components/ShowDetails";
import WatchList from "./components/WatchList";

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/logIn" element={<LogIn />} />
                <Route path="/watchList" element={<WatchList />} />
                <Route path="/searchShow" element={<SearchShow />} />
                <Route path="/show/:showId" element={<ShowDetails />} />
            </Routes>
        </Router>
    );
};

export default App;
