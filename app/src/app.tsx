import * as React from "react";
import * as mdc from "material-components-web";

import "@material/drawer/dist/mdc.drawer.css";
import "@material/list/dist/mdc.list.css";
import "@material/menu/dist/mdc.menu.css";
import "@material/tabs/dist/mdc.tabs.css";
import "@material/toolbar/dist/mdc.toolbar.css";
import "@material/typography/dist/mdc.typography.css";

import "./app.css";
import "./assets/fonts/material-icons/material-icons.css";

export default class App extends React.Component {
    render() {
        return (
            <div className="mdc-typography">
                <header className="mdc-toolbar mdc-toolbar--fixed mdc-toolbar--waterfall">
                    <div className="mdc-toolbar__row">
                        <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
                            <i className="material-icons mdc-toolbar__icon--menu toolbar-drawer-button">menu</i>
                            <span className="mdc-toolbar__title">Musique</span>
                        </section>
                        <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
                            <i className="material-icons mdc-toolbar__icon toolbar-settings-button">settings</i>
                            <i className="material-icons mdc-toolbar__icon toolbar-menu-button">more_vert</i>
                        </section>
                    </div>
                    <div className="mdc-toolbar__row">
                        <section className="mdc-toolbar__section">
                            <div className="mdc-tab-bar-scroller">
                                <div className="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--back">
                                    <i className="material-icons mdc-tab-bar-scroller__indicator__inner tab-bar-scroller-indicator">navigate_before</i>
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
                                    <i className="material-icons mdc-tab-bar-scroller__indicator__inner tab-bar-scroller-indicator">navigate_next</i>
                                </div>
                            </div>
                        </section>
                    </div>
                </header>
                <aside className="mdc-temporary-drawer">
                    <nav className="mdc-temporary-drawer__drawer">
                        <header className="mdc-temporary-drawer__header drawer-header">
                            <div className="mdc-temporary-drawer__header-content">
                                <i className="material-icons drawer-header-icon">music_note</i>
                                <span className="mdc-typography--headline drawer-header-title">Musique</span>
                            </div>
                        </header>
                        <nav className="mdc-list-group mdc-temporary-drawer__content">
                            <div className="mdc-list">
                                <a className="mdc-list-item mdc-temporary-drawer--selected" href="#">
                                    <i className="material-icons mdc-list-item__start-detail">music_note</i>Songs
                                </a>
                                <a className="mdc-list-item" href="#">
                                    <i className="material-icons mdc-list-item__start-detail">album</i>Albums
                                </a>
                                <a className="mdc-list-item" href="#">
                                    <i className="material-icons mdc-list-item__start-detail">person</i>Artists
                                </a>
                                <a className="mdc-list-item" href="#">
                                    <i className="material-icons mdc-list-item__start-detail">playlist_play</i>Playlists
                                </a>
                            </div>
                        </nav>
                    </nav>
                </aside>
                <div className="mdc-simple-menu mdc-simple-menu--open-from-top-right menu" data-tabindex="-1">
                    <ul className="mdc-list mdc-simple-menu__items" role="menu">
                        <li className="mdc-list-item" role="menuitem" data-tabindex="0">Help</li>
                        <li className="mdc-list-item" role="menuitem" data-tabindex="0">About</li>
                    </ul>
                </div>
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
        let toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector(".mdc-toolbar"));
        toolbar.fixedAdjustElement = document.querySelector(".mdc-toolbar-fixed-adjust");

        mdc.tabs.MDCTabBarScroller.attachTo(document.querySelector(".mdc-tab-bar-scroller"));

        let drawer = mdc.drawer.MDCTemporaryDrawer.attachTo(document.querySelector(".mdc-temporary-drawer"));
        document.querySelector(".toolbar-drawer-button").addEventListener("click", () => drawer.open = true);

        let menu = mdc.menu.MDCSimpleMenu.attachTo(document.querySelector(".mdc-simple-menu"));
        document.querySelector(".toolbar-menu-button").addEventListener("click", () => menu.open = true);
    }
}
