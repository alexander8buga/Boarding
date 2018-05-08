import React, { Component } from "react";
import "./Reservations.css";
import { firebaseRef } from "../../constants/constants";
import { browserHistory } from "react-router";
import firebase from "firebase";

import {
  DateRangePicker,
  SingleDatePicker,
  DayPickerRangeController
} from "react-dates";
import { form, fieldset, input } from "reactstrap";

export default class Reservations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkIn: "",
      checkOut: "",
      guests: "",
      val: this.stateVal,
      imageURLs: [],
      descriptions: [],
      titles: [],
      datesReserved: "",
      pID: "",
      prices: [],
      uID: "",
      cancellation: false,
      pendingPoints: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  componentWillMount() {
    var recievedMessage = this.props.location.state.listing;
    console.log("jja: recievedmessage" + recievedMessage);
    firebaseRef
      .ref("listing/" + recievedMessage + "/Description")
      .on("value", snap => {
        var descrptn = snap.val();
        this.state.descriptions.push(descrptn);
        this.setState({ descriptions: this.state.descriptions });
      });

    firebaseRef
      .ref("listing/" + recievedMessage + "/Title")
      .on("value", snap => {
        var title = snap.val();
        this.state.titles.push(title);
        this.setState({ titles: this.state.titles });
      });

    firebaseRef
      .ref("listing/" + recievedMessage + "/Pictures/imageURL")
      .on("value", snap => {
        var imageURL = snap.val();
        this.state.imageURLs.push(imageURL);
        this.setState({ imageURLs: this.state.imageURLs });
      });
    firebaseRef
      .ref("listing/" + recievedMessage + "/Price")
      .on("value", snap => {
        var price = snap.val();
        this.state.prices.push(price);
        this.setState({ price: this.state.prices });
      });
  }

  handleSubmit(e) {
    e.preventDefault();

    var uID = "";
    var isBooked = false;
    var isEmpty = false;
    var isCurrent = false;
    var isValidBooking = false;
    var today = new Date();

    // If the user is not logged in, it fails to push data to the database.
    // Be sure to clear cache from log in memory.
    if (firebase.auth().currentUser === null) {
      alert("User not signed in.");
      isBooked = true;
      this.props.history.push({ pathname: "/login" });
    } else {
      uID = firebase.auth().currentUser.uid;
    }

    const userReservations = {
      checkIn: this.state.checkIn,
      checkOut: this.state.checkOut,
      guests: this.state.guests,
      pID: this.props.location.state.listing,
      cancellation: false,
      paid: false,
      history: false,
      rated: false
    };
    const userPendingPoints = {
      pendingPoints: 0
    };

    var numGuests = this.state.guests;
    var chkIn = Date.parse(this.state.checkIn); //+8.64e+7;
    var chkOut = Date.parse(this.state.checkOut); //+8.64e+7;
    console.log("resev checkin: " + chkIn);
    var rootRef = firebaseRef.ref("listing/");
    var urlRef = rootRef.child(
      this.props.location.state.listing + "/DatesReserved/"
    );
    var urlResDates = rootRef.child(
      this.props.location.state.listing + "/datesReserved/"
    );

    var rootReserv = firebaseRef.ref("reservations/");
    var urlRefReserv = rootReserv.child(
      this.props.location.state.listing + "/datesReserved/"
    );

    if (firebase.auth().currentUser === null) {
      alert("User not signed in.");
      isBooked = true;
      this.props.history.push({ pathname: "/login" });
      // return;
    } else {
      uID = firebase.auth().currentUser.uid;

      // users ref reserv
      const usersResRef = firebaseRef.ref("users/" + uID + "/reservations/");
      urlResDates.once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          child.forEach(function(child2) {
            if (chkIn === child2.val()) {
              isBooked = true;
              alert("Double Booked");
            }
            if (chkOut === child2.val()) {
              isBooked = true;
              alert("Double Booked");
            }
          });
        });

        if (chkIn + 8.64e7 < Date.parse(today)) {
          isCurrent = true;
          alert(
            "Please enter a date after today (" + today.toDateString() + ")"
          );
        }
        if (chkOut + 8.64e7 < Date.parse(today)) {
          isCurrent = true;
          alert(
            "Please enter a date after today (" + today.toDateString() + ")"
          );
        }

        if (!isEmpty) {
          if (Number.isNaN(chkIn)) {
            alert("A date field is empty.");
            isEmpty = true;
          }
          if (Number.isNaN(chkOut) && !isEmpty) {
            alert("A date field is empty.");
            isEmpty = true;
          }
          if (
            numGuests == undefined ||
            numGuests == "" ||
            numGuests == null
          ) {
            alert("Please enter a number of guests.");
            isEmpty = true;
          }
          if(numGuests < 0 || numGuests > 5){
            alert("Please enter a number of guests between 0 - 5.");
            isEmpty = true;
          }

          //push to listings
          if (!isEmpty && !isCurrent && !isBooked) {
            isValidBooking = true;

            var t1 = new Date(chkIn);
            var t2 = new Date(chkOut);

            var start = new Date(chkIn);
            var end = new Date(chkOut);

            while (start <= end) {
              var newDate = start.setDate(start.getDate() + 1);
              start = new Date(newDate);
              urlResDates.push({ dr: start.getTime() });
            }

            //push the reservation to user
            usersResRef.push(userReservations);
          }
        }
      });

      if (isValidBooking) {
        this.props.history.push({
          pathname: "/paynoworlater",
          state: {
            prices: this.state.prices,
            checkIn: this.state.checkIn,
            checkOut: this.state.checkOut
          }
        });
      }
    }
  }

  render() {
    return (
      <div className="container">
        <div
          className="jumbotron j-style"
          style={{ background: "white", margin: "20px" }}
        >
          <table>
            <tbody>
              <tr>
                <th className="listingsCol">
                  <div className="listings">
                    {" "}
                    <h4 style={{ padding: "0px" }}>Reservation Overview</h4>
                    <br />
                    <div>
                      <img
                        className="card"
                        src={this.state.imageURLs}
                        alt=""
                        width="380"
                        height="300"
                      />
                      <h1 style={{ color: "#2FA4E7" }} className="card-title">
                        {this.state.titles}
                      </h1>
                      <h5
                        className="card-text"
                        style={{ marginBottom: "12px" }}
                      >
                        <cite title="Source Title">
                          {this.state.descriptions}
                        </cite>
                        <br />
                      </h5>
                      {/* <div className="row"> */}
                      <h5 style={{ color: "black" }}>
                        ${this.state.prices} per night
                      </h5>
                      {/* <h6 style={{ color: "black", textAlign: "" }}>per night</h6> */}
                      {/* </div> */}

                      <br />
                    </div>
                  </div>
                </th>
                <th className="bookingsCol">
                  <div className="bookings">
                    <section className="add-item">
                      <form
                        className="card"
                        style={{ padding: "20px" }}
                        onSubmit={this.handleSubmit}
                      >
                        <div className="form-group">
                          <label htmlFor="checkIn">Check In </label>
                          <input
                            type="date"
                            className="form-control"
                            name="checkIn"
                            placeholder="mm/dd/yyyy"
                            onChange={this.handleChange}
                            value={this.state.checkIn}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="checkOut">Check Out </label>
                          <input
                            type="date"
                            className="form-control"
                            name="checkOut"
                            placeholder="mm/dd/yyyy"
                            onChange={this.handleChange}
                            value={this.state.checkOut}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="checkOut">Number of Guests</label>
                          <input
                            type="text"
                            className="form-control"
                            name="guests"
                            placeholder="0 guests"
                            onChange={this.handleChange}
                            value={this.state.guests}
                          />
                        </div>
                        <div className="form-group">
                          <button
                            onClick={this.handleSubmit}
                            className="btn btn-success btn-block"
                          >
                            Reserve Now!
                          </button>
                        </div>
                      </form>
                    </section>
                    <section className="display-item">
                      <div className="wrapper">
                        <ul />
                      </div>
                    </section>
                  </div>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}