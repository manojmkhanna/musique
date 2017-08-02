import * as React from "react";

import "./Content.css";

export default class Content extends React.Component<any, any> {    //TODO
    render() {
        return (
            <main className="mdc-toolbar-fixed-adjust">
                {/*<div id="tab-panels">*/}
                {/**/}
                {/*</div>*/}

                {
                    new Array(100).fill("").map((value, index) => {
                        return (
                            <div key={index} style={{padding: 16}}>{index + 1}</div>
                        );
                    })
                }
            </main>
        );
    }
}
