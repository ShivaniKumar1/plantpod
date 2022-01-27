import React, {Component} from 'react';
import './Signup.css';

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
    }
    // This component makes sure that the page doesn't reload 
    // everytime the form gets submitted.
    handleSubmit(event) {
        alert('Your form was submitted')
        event.preventDefault();
    }

    handleChange(event) {
        var value = event.target.value;
        this.setState({

        })
    }
    render() {
        return (
            <div className="signup">
                <h2>Don't have an account? Create an account below.</h2>
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