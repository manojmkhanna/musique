import * as React from "react";

import "./SearchTabPanel.css";

export default class SearchTabPanel extends React.Component<any, any> {
    render() {
        return (
            <div className="tab-panel tab-panel-active" id="search-tab-panel" role="tabpanel">
                {
                    new Array(10).fill("").map((value, index) => {
                        return (
                            <div key={index} style={{padding: "16px"}}>Result {index + 1}</div>
                        );
                    })
                }
            </div>
        );
    }
}
