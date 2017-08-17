import * as React from "react";
import * as mdc from "material-components-web";

import "@material/drawer/dist/mdc.drawer.css";
import "@material/list/dist/mdc.list.css";

import "./Drawer.css";
import "../assets/fonts/material-icons/material-icons.css";

export default class Drawer extends React.Component {
    handleNavClick(index: number) {
        console.log(index);

        let navList = document.querySelector("#nav-list"),
            oldNav = navList.querySelector(".nav-selected"),
            newNav = navList.querySelector("#nav-list:nth-child(" + (index + 1) + ")");

        // if (oldNav === newNav) {
        //     console.log("return");
        //
        //     return;
        // }

        oldNav.classList.remove("nav-selected");
        oldNav.classList.remove("mdc-temporary-drawer--selected");

        newNav.classList.add("nav-selected");
        newNav.classList.add("mdc-temporary-drawer--selected");

        // this.props.handleNavClick();
    }

    render() {
        return (
            <aside className="mdc-temporary-drawer">
                <nav className="mdc-temporary-drawer__drawer">
                    <div className="mdc-temporary-drawer__toolbar-spacer" id="drawer-spacer">
                        <i className="material-icons" id="drawer-spacer-icon">music_note</i>
                        <span className="mdc-typography--title" id="drawer-spacer-title">Musique</span>
                    </div>
                    <nav className="mdc-list-group mdc-temporary-drawer__content">
                        <div className="mdc-list" id="nav-list">
                            <a className="mdc-list-item mdc-temporary-drawer--selected nav-selected" href="#" onClick={() => console.log("asd")}>
                                <i className="material-icons mdc-list-item__start-detail">queue_music</i>Deezer
                            </a>
                            <a href="#" onClick={() => console.log("asd")}>
                                <li className="mdc-list-item">
                                    <i className="material-icons mdc-list-item__start-detail">queue_music</i>Saavn
                                </li>
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
