import React, { Component } from 'react';
import withRedux from 'next-redux-wrapper';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Head from 'next/head';
import axios from 'axios';
import cookie from 'js-cookie';

import Auth from '../utils/Auth';

class AccountPage extends Component {
    static async getInitialProps({ req }) {
        // Recover User object from cookies
        // TODO: fetch them from pre-existing Redux store

        let user = undefined, token = undefined;
        // Renderered from server
        if(req) {
            user = await Auth.getUser(req.cookies.id_token, req);
        } else { // Rendered from client
            user = await Auth.getUser(cookie.get('id_token'), null);
        }
        return { user };
    }
    constructor(props) {
        super(props);
        this.state = {
            sending: false,
            updated: false,
            image: `/static/uploads/${this.props.user.image}`,
            filePreviewUrl: undefined,
            file: undefined
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onUploadProgress = this.onUploadProgress.bind(this);
    }
    onChange(e) {
        this.setState({
            filePreviewUrl: URL.createObjectURL(e.target.files[0]),
            file: e.target.files[0]
        });
    }
    onSubmit(e) {
        e.preventDefault();

        let data = new FormData();
        data.append('file', this.state.file);
        data.append('filename', this.state.file.name);

        const config = { onUploadProgress: progressEvent => this.onUploadProgress((progressEvent.loaded * 100) / progressEvent.total) };

        this.setState({ sending: true });
        axios.post(`/api/users/image`, data, config).then(res => {
            let image = this.state.filePreviewUrl;
            this.setState({ updated: true, image, filePreviewUrl: undefined, sending: false });
        }).catch(err => {
            this.setState({ updated: false, filePreviewUrl: undefined, sending: false });
        });
        //`multipart/form-data; boundary=${formData._boundary}`
    }
    onUploadProgress(percentage) {
        if(percentage === 100) {
            this.setState({ sending: false });
        }
    }
    render() {
        const { username, user, session } = this.props;
        return (
            <div>
                {this.state.updated && (
                    <div className="notification is-success">
                        <h1 className="title"><i>Success</i></h1>
                        <p>Your profile has been updated.</p>
                    </div>
                )}
                <div className="has-text-centered is-flex is-horizontal-center">
                    <Head>
                        <title>Edit Account</title>
                    </Head>
                    {user.image && (
                        <img src={!this.state.filePreviewUrl ? this.state.image : this.state.filePreviewUrl} className={'profile-image adjust' + (this.state.sending ? ' image-loading' : '')} alt={user.username}/>
                    )}
                    <br/>
                    <div>
                        <div className="file is-boxed">
                            <label className="file-label">
                                <input className="file-input" type="file" name="resume" onChange={this.onChange}/>
                                <span className="file-cta">
                                    <span className="file-icon">
                                        <i className="fas fa-upload"></i>
                                    </span>
                                    <span className="file-label">
                                        Update profile picture...
                                    </span>
                                </span>
                            </label>
                        </div>
                        <button className="button is-link is-fullwidth" onClick={this.onSubmit}>
                            Upload
                        </button>
                    </div>
                </div>
            </div>                
        )
    }
}

export default connect(/*mapStateToProps, null*/)(AccountPage);