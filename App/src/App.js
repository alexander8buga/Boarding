import React, { Component } from 'react';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import 'react-dates/lib/css/_datepicker.css';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Listings from './components/home/welcomePage/Listings'
import Welcome from './components/home/welcomePage/Welcome'
import MyRental from './components/protected/MyRental'
import { logout } from './auth/auth'
import { firebaseAuth, firebaseRef } from './constants/constants'
import Payments from './components/protected/Payments'
import Reservations from './components/protected/Reservations'
import Logo from './Logo.png';
import MyTrips from './components/protected/MyTrips'
import Listings2 from './components/home/welcomePage/Listings2'
import PayNowOrLater from './components/protected/PayNowOrLater';


function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
       : <Redirect to='/' />}
    />
  )
}



export default class App extends Component {
  state = {
    authed: false,
    loading: true,
    renter: false,
  }

  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        firebaseRef.ref('/users/'+firebaseAuth().currentUser.uid+'/info/').once('value').then(snapshot=>{
          if (snapshot.val().renter===true){
            this.setState({
              renter : snapshot.val().renter
            })
          }
        })
        this.setState({
          authed: true,
          loading: false,
        })
      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }
  componentWillUnmount () {
    this.removeListener()
  }

  constructor (props) {
    super(props)
    this.state = {
      startDate: moment()
    };
  }
  render() {
    return this.state.loading === true ? <h1>Loading</h1> : (
      <BrowserRouter>
        <div className="App">
          <nav className="navbar navbar-expand-md navbar-dark bg-primary">
            {/*<Link  style={{ padding: "5px" }} to="/">*/}
              <a href="/">
              <img src={Logo} alt="Boarding"  width="100px" height="30px"/>
              </a>
            {/*</Link>*/}
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarColor01" style={{ float: "left"}}>
                {this.state.authed ? 
                
                    <ul className="navbar-nav mx-lg-auto ">
                      <li className="nav-item active">
                        { this.state.renter == true &&
                          <Link className="nav-link" href="#" style={{color: 'white'}} to="/myrental">MyRental</Link>
                          }                  
                      </li>
                      <li className="nav-item active">
                        <Link className="nav-link" href="/mytrips" style={{color: 'white'}} to="/mytrips">MyTrips</Link>
                      </li>
                      <li className="nav-item active" style={{ float: "left"}}>
                        <Link className="nav-link" href="#" style={{color: 'white', float: "left"}} to="/"           
                          onClick={() => {logout();this.setState({renter:false})}}>Logout
                        </Link>
                      </li>
                    </ul>
                  : 
                   <ul className="navbar-nav mx-lg-auto " style={{float:"right"}}>
                      <li className="nav-item active" >
                        <Link className="nav-link " href="#" style={{color: 'white'}} to="/register">Sign Up</Link>
                      </li>
                      <li className="nav-item active">
                        <Link className="nav-link" href="#" style={{color: 'white'}} to="/login">Log In</Link>
                      </li>
                  </ul>
                  
                }
            </div>



          </nav>
            <div>
              <div>
                <Switch>
                  <Route path='/' exact component={Welcome} />
                  <Route path='/searchedlistings' exact component={Listings} />
                  <Route path='/searchedlistengs' exact component={Listings2} />
                  <PrivateRoute  authed={this.state.authed} path='/mytrips' exact component={MyTrips} />
                  <Route path='/reservations' component={Reservations} />
                  <PublicRoute authed={this.state.authed} path='/login' component={Login} />
                  <PublicRoute authed={this.state.authed} path='/register' component={Register} />
                  <PrivateRoute authed={this.state.authed} path='/myrental' component={MyRental} />
                  <PrivateRoute authed={this.state.authed} path='/paynoworlater' component={PayNowOrLater} />
                  <PrivateRoute authed={this.state.authed}  path='/payments' exact component={Payments} />
                  <Route render={() => <h3>No Match</h3>} />
                </Switch>
              </div>
            </div><br/><br/>
        </div>
      </BrowserRouter>
    );
  }
}