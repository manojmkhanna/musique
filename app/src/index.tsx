import * as React from "react";
import * as ReactDOM from "react-dom";

import Toolbar from "./toolbar";
import Content from "./content";

import "@material/typography/dist/mdc.typography.css";

import "./index.css";

import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
    <div className="mdc-typography">
        <Toolbar/>
        <Content/>
    </div>,
    document.getElementById("root")
);

registerServiceWorker();
