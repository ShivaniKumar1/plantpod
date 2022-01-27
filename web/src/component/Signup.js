import React, {Component} from 'react';
import './Signup.css';

class Signup extends Component {
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
                <h1>Create an Account.</h1>
                <form className="form-wrapper" onSubmit={this.handleSubmit}>
                    <div className="fname">
                        <label className="label">First name</label>
                        <input className="input" type="fname"/>
                    </div>
                    <div className="lname">
                        <label className="label">Last name</label>
                        <input className="input" type="lname"/>
                    </div>
                    <div className="username">
                        <label className="label">Username</label>
                        <input className="input" type="username"/>
                    </div>
                    <div className="email">
                        <label className="label">Email</label>
                        <input className="input" type="email"/>
                    </div>
                    <div className="password">
                        <label className="label">Password</label>
                        <input className="input" type="password"/>
                    </div>
                    <div className="submit">
                        <button className="submit">Submit</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Signup;