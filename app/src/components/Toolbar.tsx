import * as React from "react";
import * as mdc from "material-components-web";

import TabBar from "./TabBar";
import Menu from "./Menu";

import "@material/toolbar/dist/mdc.toolbar.css";
import "@material/menu/dist/mdc.menu.css";

import "./Toolbar.css";
import "../assets/fonts/material-icons/material-icons.css";

export default class Toolbar extends React.Component<any, any> {
    render() {
        return (
            <header className="mdc-toolbar mdc-toolbar--fixed mdc-toolbar--waterfall">
                <div className="mdc-toolbar__row">
                    <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
                        <i className="material-icons mdc-toolbar__icon--menu" id="toolbar-drawer-icon">menu</i>
                        <span className="mdc-toolbar__title">Musique</span>
                    </section>
                    <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
                        <i className="material-icons mdc-toolbar__icon" id="toolbar-settings-icon">settings</i>
                        <div className="mdc-toolbar__icon mdc-menu-anchor">
                            <i className="material-icons" id="toolbar-menu-icon">more_vert</i>
                            <Menu/>
                        </div>
                    </section>
                </div>
                <div className="mdc-toolbar__row">
                    <section className="mdc-toolbar__section">
                        <TabBar/>
                    </section>
                </div>
            </header>
        );
    }

    componentDidMount() {
        let toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector(".mdc-toolbar"));
        toolbar.fixedAdjustElement = document.querySelector(".mdc-toolbar-fixed-adjust");
    }
}
