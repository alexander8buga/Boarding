import React, { Component } from 'react'
import { login, resetPassword } from '../../auth/auth'
import "./Login.css"
function setErrorMsg(error) {
  return {
    loginMessage: error
  }
}

var firebase =require('firebase');

export default class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
        answ: 'init',
    };
    this.answerSelected=this.answerSelected.bind(this);
    this.google=this.google.bind(this);

  }
  answerSelected(event){
    var ans = this.state.answ;
    if (event.target.name==='answer1'){
      ans=event.target.value;
    } 
    this.setState({answ: ans}, function(){
      console.log('You have selected:  '+ this.state.answ);
    });
  }
  state = { loginMessage: null }
  handleSubmit = (e) => {
    e.preventDefault()
    login(this.email.value, this.pw.value)
      .catch((error) => {
          this.setState(setErrorMsg('Invalid username/password.'))
        })
  }
  resetPassword = () => {
    resetPassword(this.email.value)
      .then(() => this.setState(setErrorMsg(`Password reset email sent to ${this.email.value}.`)))
      .catch((error) => this.setState(setErrorMsg(`Email address not found.`)))
  }
  google(){
        console.log('I am in google');
        var provider = new firebase.auth.GoogleAuthProvider();
        var promise = firebase.auth().signInWithPopup(provider);
        promise.then(result => {
            var user = result.user;
            firebase.database().ref('users/'+user.uid).set({
                email: user.email,
                name: user.displayName,
                firstname: user.firstname,
                lastname: user.lastname,
                icon: user.icon,
            });
        });
        promise.catch(e=> {
            var msg =e.message;
            console.log(msg);
        });
  }

  render () {
    return (
      <div className="container login-page">
        <div className="jumbotron">
          <div className="row">
            <div className="col-sm-4 centered">
          <form onSubmit={this.handleSubmit} id="form">

              <h3>Log in</h3><br></br>
            <div className="form-group">
              <input className="form-control" style={{width: "100px"}}  style={{height: "40px"}} ref={(email) => this.email = email} placeholder="you@example.com"/>
            </div>
            <div className="form-group">
              <input className="form-control" style={{width: "100px"}} style={{height: "40px"}} type="password"  placeholder="your password" ref={(pw) => this.pw = pw} />
            </div>

              <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block" id="login"  >Log in</button>

                  <h5>or</h5>

                  <button onClick={this.google} id="google" className="btn btn-warning btn-block"  >Sign in With Google</button>

              </div>


            {
              this.state.loginMessage &&
              <div className="alert alert-danger" role="alert">
                <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                <span className="sr-only">Error:</span>
                &nbsp;{this.state.loginMessage}
              </div>
            }
            <div>
              <a href="#" onClick={this.resetPassword} className="alert-link">Forgot Password?</a>
            </div>



          </form>
          </div>
          </div>
        </div>
      </div>
    )
  }
}