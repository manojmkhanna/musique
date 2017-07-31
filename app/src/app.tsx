import * as React from "react";

import "@material/typography/dist/mdc.typography.css";
import "@material/toolbar/dist/mdc.toolbar.css";
import "@material/tabs/dist/mdc.tabs.css";

import "./app.css";
import "./assets/fonts/material-icons/material-icons.css";

const {MDCToolbar} = require("@material/toolbar");
const {MDCTabBarScroller} = require("@material/tabs");

export default class App extends React.Component {
    render() {
        return (
            <div className="mdc-typography">
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
                        <section className="mdc-toolbar__section">
                            <div className="mdc-tab-bar-scroller">
                                <div className="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--back">
                                    <a className="mdc-tab-bar-scroller__indicator__inner material-icons" href="#">navigate_before</a>
                                </div>
                                <div className="mdc-tab-bar-scroller__scroll-frame">
                                    <nav className="mdc-tab-bar mdc-tab-bar-scroller__scroll-frame__tabs">
                                        <a className="mdc-tab mdc-tab--active" href="#">Search</a>
                                        <a className="mdc-tab" href="#">Songs</a>
                                        <a className="mdc-tab" href="#">Albums</a>
                                        <a className="mdc-tab" href="#">Artists</a>
                                        <a className="mdc-tab" href="#">Playlists</a>
                                        <span className="mdc-tab-bar__indicator"/>
                                    </nav>
                                </div>
                                <div
                                    className="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--forward">
                                    <a className="mdc-tab-bar-scroller__indicator__inner material-icons" href="#">navigate_next</a>
                                </div>
                            </div>
                        </section>
                    </div>
                </header>
                <main className="mdc-toolbar-fixed-adjust">
                    {                                                                                                   //TODO: Remove later
                        new Array(100).fill("").map((value, index) => {
                            return (
                                <div key={index} style={{padding: "16px"}}>{index + 1}</div>
                            );
                        })
                    }
                </main>
            </div>
        );
    }

    componentDidMount() {
        let toolbar = MDCToolbar.attachTo(document.querySelector(".mdc-toolbar"));
        toolbar.fixedAdjustElement = document.querySelector(".mdc-toolbar-fixed-adjust");

        MDCTabBarScroller.attachTo(document.querySelector(".mdc-tab-bar-scroller"));
    }
}
