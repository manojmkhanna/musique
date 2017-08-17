import * as React from "react";

import Toolbar from "./components/Toolbar";
import Drawer from "./components/Drawer";
import Content from "./components/Content";

import "@material/typography/dist/mdc.typography.css";

import "./App.css";

export default class App extends React.Component<any, any> {
    constructor() {
        super();

        this.state = {
            app: this,
            tabIndex: 0,
            drawerIndex: 0
        };
    }

    handleNavClick(index: number) {
        console.log("Nav: " + index);
    }

    handleTabClick(index: number) {

    }

    render() {
        return (
            <div className="mdc-typography">
                <Toolbar/>
                <Drawer/>
                <Content/>
            </div>
        );
    }
}
