import React, { Component } from "react";
import PaypalExpressBtn from "react-paypal-express-checkout";
import scriptLoader from "react-async-script-loader";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { firebaseRef } from "./../../constants/constants";
import firebase from "firebase";
import "../../App.css";

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: [],
      transactionID: [],
      payerID: [],
      paymentID: [],
      paid: true,
      rewards: [],
      value: "",
      useRewards: 0,
      paymentState: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
    console.log("value: " + this.state.value);
  }
  handleClick() {
    var redeemable;
    if (
      this.state.value === "" ||
      this.state.value < 0 ||
      this.state.value === null ||
      isNaN(this.state.value)
    )
      redeemable = 0;
    else redeemable = Math.floor(this.state.value) / 100;
    this.setState({
      useRewards: redeemable
    });
  }

  componentWillMount() {
    var recievedPrice = this.props.location.state.prices;
    this.setState({ recievedPrice: this.state.price });

    var user = firebase.auth().currentUser;
    var userRefRewards = firebaseRef.ref(
      "users/" + user.uid + "/rewardedPoints"
    );
    userRefRewards.on("value", snap => {
      var rewards = snap.val();
      console.log("This is your rewards: " + rewards);
      this.state.rewards.push(rewards);
      this.setState({ rewards: this.state.rewards });
      console.log(this.state.rewards);
    });
    console.log("Current user reward points: " + this.state.rewards);
    console.log("Price received from reservation: " + recievedPrice);
    console.log("Checkin date: " + this.props.location.state.checkIn);
  }

  render() {
    const onSuccess = payment => {
      // Congratulation, it came here means everything's fine!
      console.log("The payment was succeeded!", payment);
      // set paymentID state
      var paymentID = payment.paymentID;
      this.setState({ paymentID: this.state.paymentID });

      // set payerID state
      var payerID = payment.payerID;
      this.setState({ payerID: this.state.payerID });
      console.log("payerID " + payerID);

      // set payment state to true
      var paymentState = payment.paymentState;
      this.setState({ paymentState: this.state.paymentState });
      console.log("payerID " + paymentState);

      if (firebase.auth().currentUser === null) {
        console.log(" payment succes user is not logged in! ");
      } else {
        console.log(" payment succes user is logged in! ");

        var user = firebase.auth().currentUser;

        firebaseRef
          .ref("users/" + user.uid + "/reservations/")
          .on("child_added", snap => {
            // update paid to true in user/reservation/'child_added'

            if (snap.val().checkIn == this.props.location.state.checkIn) {
              console.log("checkin loop" + snap.key);
              firebaseRef
                .ref("users/" + user.uid + "/reservations/" + snap.key)
                .update({ paid: true });
            }
          });

        firebaseRef.ref("users/" + user.uid).update({
          rewardedPoints: this.state.rewards[0] - this.state.useRewards * 100
        });
      }
      alert("Payment successful!");
      this.props.history.push({ pathname: "/" });

      // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
    };

    const onCancel = data => {
      // User pressed "cancel" or close Paypal's popup!
      console.log("The payment was cancelled!", data);
      // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
    };

    const onError = err => {
      // The main Paypal's script cannot be loaded or somethings block the loading of that script!
      console.log("Error!", err);
      // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
      // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
    };

    let env = "sandbox"; // you can set here to 'production' for production
    let currency = "USD"; // or you can set this value from your props or state
    let total = this.props.location.state.prices - this.state.useRewards; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
    // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/
    const client = {
      sandbox:
        "" // add your sandbox key here!
    };
    // In order to get production's app-ID, you will have to send your app to Paypal for approval first
    // For sandbox app-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App"):
    //   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
    // For production app-ID:
    //   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/

    // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!

    return (
      <div className="form-group">
        <br />
        <br />
        <center>
          <div className="container" style={{ background: "white" }}>
            <div className="centered-title">
              <h1>Your order summary</h1>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group" style={{ background: "white" }}>
                  <h4 style={{ margin: "0px" }}>Booking dates: </h4>
                  <div className="table-format">
                    <table width="100%">
                      <tbody>
                        <tr>
                          <td>
                            <h5>Check in:</h5>
                          </td>
                          <td>
                            <h5>{this.props.location.state.checkIn}</h5>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h5>Check out:</h5>
                          </td>
                          <td>
                            <h5>{this.props.location.state.checkOut}</h5>
                          </td>
                        </tr>
                        <br/>
                        <h4 style={{ margin: "0px" }}>Reward points: </h4>
                        <tr>
                          <td>
                            <h5>
                              Total redeemable reward points:
                            </h5>
                          </td>
                          <td>
                            <h5>{this.state.rewards}</h5>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h5>Reward point discount to be used:</h5>
                          </td>
                          <td>
                            <h5>{this.state.useRewards * 100}</h5>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <br />

                  <div className="bottom-rewards">
                    <h5 style={{ margin: "0px" }}>Rewards Points:</h5>
                    <input
                      type="text"
                      placeholder="Rewards Points: 100 = $1.00"
                      className="form-control"
                      value={this.state.value}
                      onChange={this.handleChange}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      onClick={
                        this.state.value > this.state.rewards[0] ||
                        this.state.value < 0 ||
                        isNaN(this.state.value)
                          ? () =>
                              alert(
                                "You can only enter a number up to" +
                                  this.state.rewards +
                                  "reward points!"
                              )
                          : this.handleClick
                      }
                    >
                      Add Reward Points
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group" style={{ background: "white" }}>
                  <div className="alert alert-info">
                    Please select the Paypal checkout button to continue. You
                    will then be sent to the Paypal platform to submit payment.
                  </div>
                  <PaypalExpressBtn
                    env={env}
                    client={client}
                    currency={currency}
                    total={total}
                    onError={onError}
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                  />
                  <div className="jumbotron jumbotron-flat">
                    <div className="center">
                      <h2>
                        <i>BALANCE DUE:</i>
                      </h2>
                    </div>
                    <div className="paymentAmt">
                      $
                      {this.props.location.state.prices - this.state.useRewards}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </center>
      </div>
    );
  }
}
export default Payments;