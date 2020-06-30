import React, { useState, useEffect } from 'react';
import './App.css';
import axios from "axios";

import { Menu, Layout} from 'antd';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import SalaryGuide from "./SalaryGuide";
import StatsPage  from "./StatsPage";
import About from "./About";

import 'antd/dist/antd.css';

const { Content } = Layout;

function App(){
    const [current, setCurrent] = useState("home")
    const handleClick = (e) => {
        console.log(e.key)
        setCurrent(e.key);
    };

    return (
        <Router>
            <Menu onClick={handleClick} mode="horizontal" theme="dark">
                <Menu.Item key="home">
                    <a href="/">
                    pu-salary-guide
                    </a>
                </Menu.Item>
            </Menu>
            <Content>
            <br /><br/>
            <div>
                <Switch>
                    <Route path="/about">
                        <About />
                    </Route>
                    <Route path="/graphix">
                        <StatsPage />
                    </Route>
                    <Route path="/">
                        <SalaryGuide />
                    </Route>
                </Switch>
            </div>
            </Content>
            <div style={{textAlign: "center", position: "sticky", bottom: "0"}}>
                <Link to="/about">About</Link> | Maintained by <a href="https://twitter.com/ryanjengchen">@ryanjengchen</a>.
            </div>
        </Router>
    );
}

export default App;
