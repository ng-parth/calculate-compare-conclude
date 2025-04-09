import React from 'react';
import 'antd/dist/antd.min.css';
import './App.scss';
import {Route, BrowserRouter as Router, Switch, Link} from "react-router-dom";
import Comparison from "./features/Home/Comparision";
import Details from "./features/Details/Details";
import WaMe from './features/WaMe/WaMe';
import logo from './assets/logos/compare192.png'
import LetsGo from "./features/LetsGo/LetsGo";
import LetsUpi from "./features/LetsUpi/LetsUpi";
import {HeartTwoTone} from "@ant-design/icons";
import RouteInfo from "./features/LetsGo/RouteInfo";
import {APP_NAMES, updateManifestFile} from "./redux/ServiceWorkerUtil";

function App() {
  let HomeComponent = Comparison, appName = null;
  if(APP_NAMES.LETS_GO.domains.indexOf(window.location.host) > -1) {
    HomeComponent = LetsGo;
    appName = APP_NAMES.LETS_GO.name;
  } else if (APP_NAMES.WA_ME.domains.indexOf(window.location.host) > -1) {
    HomeComponent = WaMe;
    appName = APP_NAMES.WA_ME.name;
  }
  updateManifestFile(appName)
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/" exact component={HomeComponent} />
          <Route path="/wa.me" exact component={WaMe} />

          <Route path="/all-apps" exact component={Comparison} />
          <Route path="/compare" exact component={Comparison} />
          <Route path="/details/:comparisonId" exact component={Details} />

          <Route path="/lets-go" exact component={LetsGo} />
          <Route path="/lets-go/rinfo/:routeId/:tag?" exact component={RouteInfo} />

          <Route path="/lets-upi" exact component={LetsUpi} />
        </Switch>
        <div className="footer">
          Made with <HeartTwoTone twoToneColor="#ce2e35" /> for personal use by <a href="http://ng-parth.xyz" target="_blank">ng-parth</a>.
          <br/>All rights belong to respective service providers (if used any services).
          <br/> <Link to="/all-apps">View All Apps</Link>
        </div>
      </Router>
    </div>
  );
}

export default App;
