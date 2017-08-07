import React from 'react';
import {
  Dialog,
  Divider,
  FlatButton,
  Paper,
  TextField
}
from 'material-ui';
import * as firebase from 'firebase';

export default class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      login: '',
      password: ''
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', event => {
      const { keyCode } = event;
      const enter = 13;
      if (keyCode !== enter) {
        return false;
      }
      const { login, password } = this.state;
      if (login && password) {
        this.handleAuthSubmit();
      }
    });
  }

  handleAuthChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleAuthSubmit = () => {
    const { login, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(login, password).catch(function(error) {
      alert(error.message);
    });
  }

  render() {
    return (
      <div>
                <Dialog
                  title="Login"
                  actions={<FlatButton label="Submit" primary={true} onTouchTap={this.handleAuthSubmit}/>}
                  modal={true}
                  open={true}
                >
                 <Paper zDepth={2}>
                      <TextField name="login" hintText="login" underlineShow={false} onChange={this.handleAuthChange}/>
                      <Divider />
                      <TextField name="password" type="password" hintText="password" underlineShow={false} onChange={this.handleAuthChange}/>
                      <Divider />
                    </Paper>
                </Dialog>
            </div>);
  }
}
