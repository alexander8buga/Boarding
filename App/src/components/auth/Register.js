import React, { Component } from 'react'
import { auth } from '../../auth/auth'
import "./Register2.css"
function setErrorMsg(error) {
  return {
    registerError: error.message
  }
}


var firebase =require('firebase');


export default class Register extends Component {

    signup(){
        const email = this.refs.email.value;
        const password = this.refs.password.value;
        console.log(email, password)
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email, password);
        promise
            .then(user => {
                var err ="Welcome1  " + user.email;
                firebase.database().ref('users/'+user.uid).set({
                    email: user.email
                });
                console.log(user);
                this.setState({err: err});
            });
        promise
            .catch(e =>{
                var err =e.message;
                console.log(err);
                this.setState(({err: err}));
            });
    }
    login(event){
        const email = this.refs.email.value;
        const password = this.refs.password.value;
        console.log(email, password)
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email, password)
        promise
            .then(user => {
                var lout = document.getElementById('logout');
                var err ="Welcome  " + user.email;
                this.setState({err: err});
                console.log(err);
                lout.classList.remove('hide');
                var lin = document.getElementById('login');
                lin.classList.add('hide');
                var signup = document.getElementById('signup');
                signup.classList.add('hide');
                var userBtn = document.getElementById('email');
                userBtn.classList.add('hide');
                var passBtn = document.getElementById('pass');
                passBtn.classList.add('hide');
            });
        promise.catch(e =>{
            var err=e.message;
            console.log(err);
            this.setState({err: err});
        });
    }
    logout(){
        const promise = firebase.auth().signOut();
        var lout = document.getElementById('logout');
        lout.classList.add('hide');
        var lin = document.getElementById('login');
        lin.classList.remove('hide');
        var signup = document.getElementById('signup');
        signup.classList.remove('hide');
        var userBtn = document.getElementById('email');
        userBtn.classList.remove('hide');
        var passBtn = document.getElementById('pass');
        passBtn.classList.remove('hide');
    }



  constructor (props) {
    super(props)
    this.state = {
        answ: 'init',
        err: ""
    };
    this.answerSelected=this.answerSelected.bind(this);
      this.login=this.login.bind(this);
      this.signup=this.signup.bind(this);
      this.logout=this.logout.bind(this);

    
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
  state = { registerError: null }
  handleSubmit = (e) => {
    e.preventDefault()
    auth(this.email.value, this.pw.value,  this.state.answ)
      .catch(e => this.setState(setErrorMsg(e)))
  }
  render () {
    return (
      <div className="container register-page" style={{width: "940px"}}>
        <div className="jumbotron">
          <div className="row">
           <div className="col-sm-5 centered">
            <form onSubmit={this.handleSubmit}>
              <h3>Sign Up</h3>
             {
              this.state.registerError &&
              <div className="alert alert-danger" role="alert">
                <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                <span className="sr-only">Error:</span>
                &nbsp;{this.state.registerError}
              </div>
             }
             <br/>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-10">
                            <div className="radio">
                                <label className="col-sm-5 offset-1"><input type="radio" name="answer1" value="Guest" onChange={this.answerSelected}/> Guest</label>
                                <label className="col-sm-5 offset-1"><input type="radio" name="answer1" value="Landlord" onChange={this.answerSelected}/> Landlord</label>
                            </div>
                        </div>
                    </div>
                </div>
             <div>
              <div className={'form-group'}>
               <input  className="form-control" style={{width: "100px"}}  style={{height: "40px"}} id="email" ref="email" type="email" placeholder='Type email here...' />
              </div>
             <div className={'form-group'}>
              <input  id="pass" className="form-control" style={{width: "100px"}}  style={{height: "40px"}} ref="password" type="password" placeholder='Type password here...' />
             </div>
              <p>  {this.state.err}</p>
              <button onClick={this.signup}id = "signup" className="btn btn-danger btn-block"  style={{width: "250px"}} style={{height: "40px"}}>Sign Up</button>

            </div>

           </form>
           </div>
          </div>
        </div>
      </div>
    )
  }
}