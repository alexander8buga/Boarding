import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import saveUser from "./../../auth/auth";
import { firebaseRef } from "./../../constants/constants";
import firebase from "firebase";
import ReactModal from "react-modal";
import Rating from "./Rating";
import { browserHistory } from "react-router";
import { Link } from 'react-router-dom'


export default class MyTrips extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkInResUpcoming: [],
      checkInResHistory: [],
      checkOutResUpcoming: [],
      checkOutResHistory: [],
      pidResUpcoming: [],
      pidResHistory: [],
      prices: [],
      rewards: [],
      pendingPoints: [],
      cancelPayment: [],
      cancResHistory: [],
      typePaid: [],
      titleHistory: [],
      titleUpcoming: [],
      showButtonPay: [],
      address: [],
      showModalPay: false,
      showButtonRate: [],
      showModalRate: false,

      imageURL: [],
      descriptions: [],
      titles: []
    };
    this.handlePayNow = this.handlePayNow.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    
  }

  handleOpenModal() {
    this.setState({ showModalPay: true });
  }

  handleCloseModal() {
    this.setState({ showModalPay: false });
  }

  handlePayNow(items) {
    this.props.history.push({
      pathname: "/payments",
      state: {
        prices: this.state.prices[items],
        checkIn: this.state.checkInResUpcoming[items], checkOut: this.state.checkOutResUpcoming[items]
      }
    });

  }

  handleChange(items) {
    console.log(
      "item check in clicked: " + this.state.checkInResUpcoming[items]
    );
    console.log(
      "item check out clicked: " + this.state.checkOutResUpcoming[items]
    );

    // delete a reservation
    if (firebase.auth().currentUser === null) {
      console.log(" handle click user is not logged in! ");
    } else {
      var user = firebase.auth().currentUser;

      // delete dates in listing so they can be free for new reservation
      firebaseRef
        .ref("users/" + user.uid + "/reservations/")
        .on("child_added", snap => {
          // compare dates to see where to update cancel!
          if (snap.val().checkIn === this.state.checkInResUpcoming[items]) {
            // update cancel to true
            firebaseRef
              .ref("users/" + user.uid + "/reservations/" + snap.key)
              .update({ cancellation: true });
          }

          // get the post ID to delete the canceled dates
          var postingID = snap.val().pID;
          var start = new Date(this.state.checkInResUpcoming[items]);
          var end = new Date(this.state.checkOutResUpcoming[items]);

          // delete the dates in listings only not in reservation collections
          while (start <= end) {
            var newDate = start.setDate(start.getDate() + 1);
            start = new Date(newDate);
            firebaseRef.ref("listing/" + postingID).on("child_added", snap => {
              if (snap.key === "datesReserved") {
                firebaseRef
                  .ref("listing/" + postingID + "/datesReserved/")
                  .on("child_added", snap => {
                    var key = snap.key;
                    firebaseRef
                      .ref(
                        "listing/" + postingID + "/datesReserved/" + snap.key
                      )
                      .on("child_added", snap => {
                        if (start.getTime() === snap.val()) {
                          console.log("FOUND " + snap.key + postingID);
                          firebaseRef
                            .ref(
                              "listing/" + postingID + "/datesReserved/" + key
                            )
                            .remove();
                        }
                      });
                  });
              }
            });
          }
        });
        console.log("Print: "+ this.state.pidResUpcoming[items]);
      this.props.history.push({ pathname: "/reservations", state: {
        listing: this.state.pidResUpcoming[items],
      }});
    }
  }

  handleClick(items) {
    console.log(
      "item check in clicked: " + this.state.checkInResUpcoming[items]
    );
    console.log(
      "item check out clicked: " + this.state.checkOutResUpcoming[items]
    );

    // delete a reservation
    if (firebase.auth().currentUser === null) {
      console.log(" handle click user is not logged in! ");
    } else {
      var user = firebase.auth().currentUser;

      // delete dates in listing so they can be free for new reservation
      firebaseRef
        .ref("users/" + user.uid + "/reservations/")
        .on("child_added", snap => {
          // compare dates to see where to update cancel!
          if (snap.val().checkIn === this.state.checkInResUpcoming[items]) {
            // update cancel to true
            firebaseRef
              .ref("users/" + user.uid + "/reservations/" + snap.key)
              .update({ cancellation: true });
          }

          // get the post ID to delete the canceled dates
          var postingID = snap.val().pID;
          var start = new Date(this.state.checkInResUpcoming[items]);
          var end = new Date(this.state.checkOutResUpcoming[items]);

          // delete the dates in listings only not in reservation collections
          while (start <= end) {
            var newDate = start.setDate(start.getDate() + 1);
            start = new Date(newDate);
            firebaseRef.ref("listing/" + postingID).on("child_added", snap => {
              if (snap.key === "datesReserved") {
                firebaseRef
                  .ref("listing/" + postingID + "/datesReserved/")
                  .on("child_added", snap => {
                    var key = snap.key;
                    firebaseRef
                      .ref(
                        "listing/" + postingID + "/datesReserved/" + snap.key
                      )
                      .on("child_added", snap => {
                        if (start.getTime() === snap.val()) {
                          console.log("FOUND " + snap.key + postingID);
                          firebaseRef
                            .ref(
                              "listing/" + postingID + "/datesReserved/" + key
                            )
                            .remove();
                        }
                      });
                  });
              }
            });
          }
        });

      this.props.history.push({ pathname: "/" });
    }
  }

  componentWillMount() {
    if (firebase.auth().currentUser === null) {
      console.log("user is not logged in! ");
    } else {
      console.log("user islogged in! ");
      var user = firebase.auth().currentUser;
      var userRefRes = firebaseRef.ref("users/" + user.uid + "/reservations");
      var userRefRewards = firebaseRef.ref(
        "users/" + user.uid + "/rewardedPoints"
      );
      var userRefPendingPoints = firebaseRef.ref(
        "users/" + user.uid + "/pendingPoints"
      );

      // read rewards
      userRefRewards.on("value", snap => {
        var rewards = snap.val();
        this.state.rewards.push(rewards);
        this.setState({ rewards: this.state.rewards });
      });

      // read pending Points
      userRefPendingPoints.on("value", snap => {
        var pendingPoints = snap.val();
        this.state.pendingPoints.push(pendingPoints);
        this.setState({ pendingPoints: this.state.pendingPoints });
      });

      // read  for upcoming reservations
      userRefRes.on("child_added", snap => {
        var keyRes = snap.key;
        firebaseRef
          .ref("users/" + user.uid + "/reservations/" + keyRes)
          .on("value", snap => {
            //check if cancellation is true  or false
            if (!snap.val().cancellation && !snap.val().history) {
              // store the cancellation value true to know when to display the pay button
              if (snap.val().paid) {
                this.state.showButtonPay.push(false);
                this.setState({ false: this.state.showButtonPay });
              } else {
                this.state.showButtonPay.push(true);
                this.setState({ true: this.state.showButtonPay });
              }

              // get the title of the posting for Upcoming
              firebaseRef
                .ref("users/" + user.uid + "/reservations/" + keyRes + "/pID/")
                .on("value", snap => {
                  var pidResUpcoming = snap.val();

                  // store post id for upcoming reservation
                  this.state.pidResUpcoming.push(pidResUpcoming);

                  firebaseRef
                    .ref("listing/" + pidResUpcoming)
                    .on("value", snap => {
                      var titleUpcoming = snap.val().Title;
                      var priceUpcoming = snap.val().Price;
                      var address = snap.val().Address;

                      //store the address of the posting
                      this.state.address.push(address);
                      this.setState({ address: this.state.address });

                      //store the title of the posting for upcoming reservation
                      this.state.titleUpcoming.push(titleUpcoming);
                      this.setState({
                        titleUpcoming: this.state.titleUpcoming
                      });

                      //store the price of the posting for upcoming reservation
                      this.state.prices.push(priceUpcoming);
                      this.setState({ priceUpcoming: this.state.prices });
                    });
                });

              var checkInRef = firebaseRef
                .ref("users/" + user.uid + "/reservations/" + keyRes)
                .on("value", snap => {
                  var checkInResUpcoming = snap.val().checkIn;
                  var checkOutResUpcoming = snap.val().checkOut;

                  // store check in date
                  this.state.checkInResUpcoming.push(checkInResUpcoming);
                  this.setState({
                    checkInResUpcoming: this.state.checkInResUpcoming
                  });
                  // store check out date
                  this.state.checkOutResUpcoming.push(checkOutResUpcoming);
                  this.setState({
                    checkOutResUpcoming: this.state.checkOutResUpcoming
                  });
                });
            } //end if : decide whenever the reservation is upcoming or history
          }); //end loop reservation
      }); //end history reading

      // read for history reservations when cancel: true
      userRefRes.on("child_added", snap => {
        var keyRes = snap.key;
        // read each reservation
        firebaseRef
          .ref("users/" + user.uid + "/reservations/" + keyRes)
          .on("value", snap => {
            // check if history is true or cancellation is true
            if (snap.val().cancellation || snap.val().history) {
              // store the value of paid state to know when to display Rate button
              if (snap.val().paid && !snap.val().rated && !snap.val().cancellation) {
                this.state.showButtonRate.push(true);
                this.setState({ true: this.state.showButtonRate });
              } else {
                this.state.showButtonRate.push(false);
                this.setState({ false: this.state.showButtonRate });
              }

              // get the title of the posting for History
              firebaseRef
                .ref("users/" + user.uid + "/reservations/" + keyRes + "/pID/")
                .on("value", snap => {
                  var pidResHistory = snap.val();
                  //store post id for history reservation
                  this.state.pidResHistory.push(pidResHistory);
                  this.setState({ pidResHistory: this.state.pidResHistory });
                  console.log("PID" + pidResHistory);

                  firebaseRef
                    .ref("listing/" + pidResHistory + "/Title")
                    .on("value", snap => {
                      var titleHistory = snap.val();
                      //store title of the post for history reservation
                      this.state.titleHistory.push(titleHistory);
                      this.setState({ titleHistory: this.state.titleHistory });
                    });
                });

              firebaseRef
                .ref("users/" + user.uid + "/reservations/" + keyRes)
                .on("value", snap => {
                  var checkInResHistory = snap.val().checkIn;
                  var checkOutResHistory = snap.val().checkOut;

                  // store the check in date for history reservation
                  this.state.checkInResHistory.push(checkInResHistory);
                  this.setState({
                    checkInResHistory: this.state.checkInResHistory
                  });

                  // store the check Out date for history reservation
                  this.state.checkOutResHistory.push(checkOutResHistory);
                  this.setState({
                    checkOutResHistory: this.state.checkOutResHistory
                  });
                });
              // get the type of payment Canceled or Paid
              firebaseRef
                .ref("users/" + user.uid + "/reservations/" + keyRes)
                .on("value", snap => {
                  if (snap.val().cancellation) {
                    this.state.typePaid.push("Cancelled");
                    this.setState({ Cancelled: this.state.typePaid });
                    console.log("canceled trip!!!!");
                  } else if (snap.val().paid && snap.val().history) {
                    this.state.typePaid.push("Paid");
                    this.setState({ Paid: this.state.typePaid });
                  }
                }); // if cancel value check
            }
          }); //end loop reservation
      }); //end history reading
    }
  }

  render() {
    var showUpcomingRes;
    var chkInU;
    var chkOutU;
    if (this.state.pidResUpcoming.length === 0) {
      showUpcomingRes = (
        <div>
          <center>No upcoming reservations yet!</center>
        </div>
      );
    } else {
      showUpcomingRes = this.state.checkInResUpcoming.map(
        (checkInResUpcoming, items) => (
          <div className="card" key={items}>
            <div style={{ padding: "20px", margin: "10px" }}>
              <div className="row">
                <div >
                  <div className="payment-style">
                    <div className="h1-style">
                      <h2 style={{ color: "black" }}>
                        <span style={{ color: "#2FA4E7" }}>
                          {this.state.titleUpcoming[items]}
                        </span>
                      </h2>
                      <div className="container">
                        <div className="row row-space">
                          <script>
                            {(chkInU = this.state.checkInResUpcoming[items])}
                            {(chkOutU = this.state.checkOutResUpcoming[items])}
                          </script>
                          <h5>{chkInU}</h5>
                          <h5>{"to"}</h5>
                          <h5>{chkOutU}</h5>
                        </div>
                      </div>
                      <h7>
                        <a
                          href={
                            "http://maps.google.com/?q=" +
                            JSON.stringify(this.state.address[items])
                          }
                        >
                          See on map
                        </a>
                      </h7>
                    </div>
                  </div>
                  {/* <hr /> */}
                  <div className="container">
                    <div className="row">
                      <div>
                        <button
                          style={{ margin: "10px" }}
                          className="btn btn-primary"
                          onClick={this.handleOpenModal}
                        >
                          Cancel
                        </button>
                        <button
                          style={{ margin: "10px" }}
                          className="btn btn-primary"
                          onClick={evt => this.handleChange(items, evt)}
                        >
                          Change
                        </button>
                        <ReactModal
                          isOpen={this.state.showModalPay}
                          contentLabel="Inline Styles Modal Example"
                          style={{
                            overlay: {
                              backgroundColor: "lightgray"
                            },
                            content: {
                              color: "black"
                            }
                          }}
                        >
                          <center>
                            <br/>
                            <br/>
                            <h3 style={{color: "black"}}>You will be charged $50 fee</h3>
                            <br/>
                            <h3 style={{color: "black"}}>Do you want to proceed?</h3>
                            <br/>
                          </center>
                          <center>
                            <button
                              className="btn btn-secondary btn-lg px-4"
                              style={{ margin: "10px" }}
                              onClick={this.handleCloseModal}
                            >
                              No
                            </button>
                            <button
                              className="btn btn-warning btn-lg px-4"
                              style={{ margin: "10px" }}
                              onClick={evt => this.handleClick(items, evt)}
                            >
                              Yes
                            </button>
                          </center>
                        </ReactModal>
                      </div>
                      <div>
                        {this.state.showButtonPay[items] ? (
                          <button
                            style={{ margin: "10px" }}
                            className="btn btn-success"
                            onClick={evt => this.handlePayNow(items, evt)}
                          >
                            Pay Now
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      );
    }

    var showHistoryRes;
    if (this.state.pidResHistory.length === 0) {
      showHistoryRes = (
        <div>
          <center>No history yet!</center>
        </div>
      );
    } else {
      showHistoryRes = this.state.checkInResHistory.map(
        (checkInResHistory, items) => (
          <div className="card" key={items}>
            <div style={{ padding: "20px", margin: "10px" }}>
              <div className="container">
                <div className="row">
                  <h4 style={{ color: "black" }}>
                    {" "}
                    <span style={{ color: "#2FA4E7", margin: "5px" }}>
                      {this.state.titleHistory[items]}
                    </span>
                  </h4>{" "}
                  <h4 style={{ color: "black" }}>Dates:</h4>
                  <span style={{ color: "black", margin: "5px" }}>from </span>
                  <h4>{this.state.checkInResHistory[items]}</h4>
                  <span style={{ color: "black", margin: "5px" }}>to </span>
                  <h4>
                    {this.state.checkOutResHistory[items]}{" "}
                    <span style={{ color: "black", margin: "5px" }}>Reservation:</span>{" "}
                    {this.state.typePaid[items]}
                  </h4>
                  <div className="container">
                    <div className="row">
                      {this.state.showButtonRate[items] ? (
                        <Rating pid={this.state.pidResHistory[items]} />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      );
    }

    return (
      <div className="container">
        <div className="jumbotron" style={{ margin: "20px", paddingTop:"0px", paddingBottom:"0px" }}>
          <h2 style={{color: "black"}}>Upcoming</h2>
          <br />
          {showUpcomingRes}
        </div>

        <div className="jumbotron" style={{ margin: "20px", paddingTop:"0px", paddingBottom:"0px" }}>
          <h2 style={{color: "black"}}>History</h2>
          <br />
          {showHistoryRes}
          <br />
        </div>
        <div className="jumbotron" style={{ margin: "20px", paddingTop:"0px", paddingBottom:"0px" }}>
          <h2 style={{color: "black"}}>Reward Points</h2>
          <br />
          <div className="card" style={{ padding: "20px", margin: "10px" }}>
            <div className="form-group">
              <div className="input-group ">
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <h6>Available Points</h6>
                      <h3 style={{ color: "black" }}> {this.state.rewards}</h3>
                    </div>
                  </div>
                </div>
                {/*}
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <h6>Pending Points</h6>
                      <h3 style={{ color: "black" }}>
                        {" "}
                        {this.state.pendingPoints}
                      </h3>
                    </div>
                  </div>
                </div>
                */}
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <h6>Points value</h6>
                      <h3 style={{ color: "black" }}>
                        {" "}
                        ${this.state.rewards * 0.01}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>  
        </div>
      </div>
    );
  }
}