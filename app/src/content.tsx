import * as React from "react";

import "./content.css";

export default class Content extends React.Component<any, any> {
    render() {
        return (
            <main className="mdc-toolbar-fixed-adjust">
                {                                                                                                       //TODO: Remove later
                    new Array(100).fill("").map((value, index) => {
                        return (
                            <div key={index} style={{padding: "16px"}}>{index + 1}</div>
                        );
                    })
                }
            </main>
        );
    }
}
