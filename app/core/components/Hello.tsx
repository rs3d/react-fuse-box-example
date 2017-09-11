import * as React from "react";
import './Hello.scss';

export interface IHelloProps { compiler: string; framework: string; }

// State is never set so we use the 'undefined' type.
export class Hello extends React.Component<IHelloProps, undefined> {
    public render() {
        return <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>;
    }
}
