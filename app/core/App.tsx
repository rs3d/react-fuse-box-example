import * as React from "react";
import * as ReactDOM from "react-dom";
import './App.scss';
import { Hello } from "./components/Hello";


export interface IAppProps { name: string; }
// export const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;

export default class App extends React.Component<IAppProps, undefined> {
    public render() {
        return (
            <div className="app">
                <Hello compiler="typescript" framework="react" />
                <h2>Feature List for {this.props.name}</h2>
                <ul>
                    <li>React</li>
                    <li>FuseBox</li>
                    <li>Typescript</li>
                    <li>Sass</li>
                    <li>Express Dev Server</li>
                </ul>
            </div>
        );
    }
}

export const component = ReactDOM.render(<App name="react-fuse-box" />, document.getElementById("root"));

