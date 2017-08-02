import * as React from "react";

import "@material/typography/dist/mdc.typography.css";

import Toolbar from "./components/Toolbar";
import Drawer from "./components/Drawer";
import Menu from "./components/Menu";
import Content from "./components/Content";

import "./App.css";

export default class App extends React.Component<any, any> {
    render() {
        return (
            <div className="mdc-typography">
                <Toolbar/>
                <Drawer/>
                <Menu/>
                <Content/>
            </div>
        );
    }
}
