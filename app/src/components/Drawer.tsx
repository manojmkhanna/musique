import * as React from "react";
import * as mdc from "material-components-web";

import "@material/drawer/dist/mdc.drawer.css";
import "@material/list/dist/mdc.list.css";

import "./Drawer.css";
import "../assets/fonts/material-icons/material-icons.css";

export default class Drawer extends React.Component<any, any> {
    render() {
        return (
            <aside className="mdc-temporary-drawer">
                <nav className="mdc-temporary-drawer__drawer">
                    <div className="mdc-temporary-drawer__toolbar-spacer" id="drawer-spacer">
                        <i className="material-icons" id="drawer-spacer-icon">music_note</i>
                        <span className="mdc-typography--title" id="drawer-spacer-title">Musique</span>
                    </div>
                    <nav className="mdc-list-group mdc-temporary-drawer__content">
                        <div className="mdc-list">
                            <a className="mdc-list-item mdc-temporary-drawer--selected" href="#">
                                <i className="material-icons mdc-list-item__start-detail">library_music</i>Deezer
                            </a>
                            <a className="mdc-list-item" href="#">
                                <i className="material-icons mdc-list-item__start-detail">library_music</i>Saavn
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
