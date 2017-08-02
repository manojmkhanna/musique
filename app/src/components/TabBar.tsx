import * as React from "react";
import * as mdc from "material-components-web";

import "@material/tabs/dist/mdc.tabs.css";

import "./TabBar.css";
import "../assets/fonts/material-icons/material-icons.css";

export default class TabBar extends React.Component<any, any> {
    render() {
        return (
            <div className="mdc-tab-bar-scroller">
                <div className="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--back">
                    <i className="material-icons mdc-tab-bar-scroller__indicator__inner tab-bar-scroller-icon">navigate_before</i>
                </div>
                <div className="mdc-tab-bar-scroller__scroll-frame">
                    <nav className="mdc-tab-bar mdc-tab-bar-scroller__scroll-frame__tabs" role="tablist">
                        <a className="mdc-tab mdc-tab--active" role="tab" href="#">Search</a>
                        <a className="mdc-tab" role="tab" href="#">Songs</a>
                        <a className="mdc-tab" role="tab" href="#">Albums</a>
                        <a className="mdc-tab" role="tab" href="#">Artists</a>
                        <a className="mdc-tab" role="tab" href="#">Playlists</a>
                        <span className="mdc-tab-bar__indicator"/>
                    </nav>
                </div>
                <div className="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--forward">
                    <i className="material-icons mdc-tab-bar-scroller__indicator__inner tab-bar-scroller-icon">navigate_next</i>
                </div>
            </div>
        );
    }

    componentDidMount() {
        mdc.tabs.MDCTabBarScroller.attachTo(document.querySelector(".mdc-tab-bar-scroller"));

        // let tabBar = new mdc.tabs.MDCTabBar(document.querySelector(".mdc-tab-bar")); //TODO
        // tabBar.listen("MDCTabBar:change", ({detail: tabs}) => {
        //     let tabPanels = document.querySelector("#tab-panels");
        //
        //
        // });
    }
}
