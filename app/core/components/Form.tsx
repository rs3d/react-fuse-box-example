import * as React from "react";

export interface IFormProps { }
export interface IFormState { foo: string; }

export class Form extends React.Component<IFormProps, IFormState> {
    constructor() {
        super();
        this.state = {
            foo: 'TEST'
        }
    }
    public render() {
        return <form onSubmit={this.handleSubmit}>
            <div>
                <h3>Preview</h3>
                <pre>
                { this.state.foo }
                </pre>
            </div>
            <input type="text" name="foo" defaultValue={this.state.foo} onChange={this.handleChange} />
            <button type="submit">Submit</button>
        </form>;
    }
    private handleChange = (event) => {
        console.dir(event.target);
        this.setState({
            [event.target.name] : event.target.value.trim()
        });
    }
    private handleSubmit = (event) => {
        event.preventDefault();
        console.log(event, this.state);
    }
}
