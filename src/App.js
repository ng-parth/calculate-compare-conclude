import React from 'react';
import 'antd/dist/antd.min.css';
import './App.scss';
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import Comparison from "./features/Home/Comparision";
import Details from "./features/Details/Details";
import WaMe from './features/WaMe/WaMe';
import logo from './assets/logos/compare192.png'
import LetsGo from "./features/LetsGo/LetsGo";
import LetsUpi from "./features/LetsUpi/LetsUpi";
import {HeartTwoTone} from "@ant-design/icons";
import RouteInfo from "./features/LetsGo/RouteInfo";

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/" exact component={Comparison} />
          <Route path="/wa.me" exact component={WaMe} />
          <Route path="/details/:comparisonId" exact component={Details} />
          <Route path="/lets-go" exact component={LetsGo} />
          <Route path="/lets-go/rinfo/:routeId/:tag?" exact component={RouteInfo} />
          <Route path="/lets-upi" exact component={LetsUpi} />
        </Switch>
      </Router>
        <div className="footer">
            Made with <HeartTwoTone twoToneColor="#ce2e35" /> for personal use by <a href="http://ng-parth.xyz" target="_blank">ng-parth</a>.
            <br/>All rights belong to respective service providers (if used any services).
        </div>
    </div>
  );
}

export default App;
