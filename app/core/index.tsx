import * as React from "react";
import * as ReactDOM from "react-dom";
import './index.scss';

export interface IAppProps { name: string; }
// export const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;

class App extends React.Component<IAppProps, undefined> {
    public render() {
      return (
        <div className="shopping-list">
          <h1>Shopping List for {this.props.name}</h1>
          <ul>
            <li>Instagram</li>
            <li>WhatsApp</li>
            <li>Oculus</li>
            <li>Rift</li>
          </ul>
        </div>
      );
    }
  }

ReactDOM.render(<App name="Jane" />, document.getElementById("root"));
console.log('test 5');
