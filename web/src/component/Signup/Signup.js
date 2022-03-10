import React, {Component} from 'react';

export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fName:"",
            lName:"",
            userName:"",
            email:"",
            password:""
        };
        this.onSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        alert('Your form was submitted')
        event.preventDefault();
        var self = this;
    }

    render() {
        return (
            <div className="signup">
                <h2>Create an account below.</h2>
                <form className="form-wrapper" onSubmit={this.handleSubmit}>
                    <label className="label">
                        <p>First name</p>
                        <input type="fname"/>
                    </label>
                    <label className="label">
                        <p>Last name</p>
                        <input type="lname"/>
                    </label>
                    <label className="label">
                        <p>Username</p>
                        <input type="username"/>
                    </label>
                    <label className="label">
                        <p>Email</p>
                        <input type="email"/>
                    </label>
                    <label className="label">
                        <p>Password</p>
                        <input type="password"/>
                    </label>
                    <div className="submit">
                        <button className="submit">Submit</button>
                    </div>
                </form>
            </div>
        );
    }
}
