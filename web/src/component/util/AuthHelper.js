// taken from https://stackoverflow.com/a/56746441

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { getToken } from './../util/JWTHelper';

class AuthHelper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Authenticated: false,
        };
    }

    componentDidMount() {
        const { history } = this.props;
        const jwt = getToken();
        if (!jwt) {
            history.push('/login');
        } else {
            this.setState({ Authenticated: true });
        }
    }

    render() {
        const { children } = this.props;
        const { Authenticated } = this.state;
        if (Authenticated === false) {
            return (
                <div>loading....</div>
            );
        }
        return (
            <div>
                {children}
            </div>
        );
    }
}

export default withRouter(AuthHelper);
