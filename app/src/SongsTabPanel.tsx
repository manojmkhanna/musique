import * as React from "react";

import "./SongsTabPanel.css";

export default class SongsTabPanel extends React.Component<any, any> {
    render() {
        return (
            <div className="tab-panel" id="songs-tab-panel" role="tabpanel">
                {
                    new Array(10).fill("").map((value, index) => {
                        return (
                            <div key={index} style={{padding: "16px"}}>Song {index + 1}</div>
                        );
                    })
                }
            </div>
        );
    }
}
