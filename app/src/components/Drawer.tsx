import * as React from "react";
import * as mdc from "material-components-web";

import "@material/drawer/dist/mdc.drawer.css";
import "@material/list/dist/mdc.list.css";

import "./Drawer.css";
import "../assets/fonts/material-icons/material-icons.css";

export default class Drawer extends React.Component<any, any> { //TODO
    render() {
        return (
            <aside className="mdc-temporary-drawer">
                <nav className="mdc-temporary-drawer__drawer">
                    <header className="mdc-temporary-drawer__header" id="drawer-header">
                        <div className="mdc-temporary-drawer__header-content">
                            <i className="material-icons" id="drawer-header-icon">music_note</i>
                            <span className="mdc-typography--headline" id="drawer-header-title">Musique</span>
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
        );
    }

    componentDidMount() {
        let drawer = mdc.drawer.MDCTemporaryDrawer.attachTo(document.querySelector(".mdc-temporary-drawer"));
        document.querySelector("#toolbar-drawer-icon").addEventListener("click", () => drawer.open = true);
    }
}
