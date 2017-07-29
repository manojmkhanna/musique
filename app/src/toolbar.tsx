import * as React from "react";

import "@material/toolbar/dist/mdc.toolbar.css";
import "@material/tabs/dist/mdc.tabs.css";

import "./toolbar.css";
import "./assets/fonts/material-icons/material-icons.css";

const {MDCToolbar} = require("@material/toolbar");

export default class Toolbar extends React.Component<any, any> {
    render() {
        return (
            <header className="mdc-toolbar mdc-toolbar--fixed mdc-toolbar--waterfall">
                <div className="mdc-toolbar__row">
                    <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
                        <a className="mdc-toolbar__icon--menu material-icons" href="#">menu</a>
                        <span className="mdc-toolbar__title">Musique</span>
                    </section>
                    <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
                        <a className="mdc-toolbar__icon material-icons" href="#">settings</a>
                        <a className="mdc-toolbar__icon material-icons" href="#">more_vert</a>
                    </section>
                </div>
                <div className="mdc-toolbar__row">
                    <nav className="mdc-tab-bar">
                        <a className="mdc-tab mdc-tab--active" href="#">Search</a>
                        <a className="mdc-tab" href="#">Songs</a>
                        <a className="mdc-tab" href="#">Albums</a>
                        <a className="mdc-tab" href="#">Artists</a>
                        <a className="mdc-tab" href="#">Playlists</a>
                        <span className="mdc-tab-bar__indicator"/>
                    </nav>
                </div>
            </header>
        );
    }

    componentDidMount() {
        const toolbar = MDCToolbar.attachTo(document.querySelector(".mdc-toolbar"));
        toolbar.fixedAdjustElement = document.querySelector(".mdc-toolbar-fixed-adjust");
    }
}
