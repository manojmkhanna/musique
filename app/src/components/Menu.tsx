import * as React from "react";
import * as mdc from "material-components-web";

import "@material/menu/dist/mdc.menu.css";
import "@material/list/dist/mdc.list.css";

import "./Menu.css";

export default class Menu extends React.Component<any, any> {
    render() {
        return (
            <div className="mdc-simple-menu mdc-simple-menu--open-from-top-right" id="menu" tabIndex={-1}>
                <ul className="mdc-list mdc-simple-menu__items" role="menu">
                    <li className="mdc-list-item" role="menuitem" tabIndex={0}>About</li>
                </ul>
            </div>
        );
    }

    componentDidMount() {
        let menu = mdc.menu.MDCSimpleMenu.attachTo(document.querySelector(".mdc-simple-menu"));
        document.querySelector("#toolbar-menu-icon").addEventListener("click", () => menu.open = true);
    }
}
