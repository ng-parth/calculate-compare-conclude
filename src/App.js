import React from 'react';
import 'antd/dist/antd.min.css';
import './App.scss';
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import Comparison from "./features/Home/Comparision";
import Details from "./features/Details/Details";
import WaMe from './features/WaMe/WaMe';
import logo from './assets/logos/compare192.png'

function App() {
  return (
    <div className="app">
      <img src={logo} className="logo--main" alt="Logo" />
      <Router>
        <Switch>
          <Route path="/" exact component={Comparison} />
          <Route path="/wa.me" exact component={WaMe} />
          <Route path="/details/:comparisonId" exact component={Details} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
