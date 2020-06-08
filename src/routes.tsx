import React from "react";
import { Route, BrowserRouter} from "react-router-dom";

import Home from "./pages/Home";
import CreateCollectorPoint from "./pages/CreateCollectorPoint";

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact/>
            <Route component={CreateCollectorPoint} path="/create-collector-point"/>
        </BrowserRouter>
    );
};

export default Routes;