import React from "react";
import { firebaseRef } from "./../../../constants/constants";
import Rating from "./../../rating/Rating";
import { browserHistory } from "react-router";
import { withRouter } from "react-router-dom";
import Filter2 from "./Filter2";

var Listings2 = React.createClass({
  getInitialState: function() {
    return {
      val: this.stateVal,
      imageURLs: [],
      descriptions: [],
      addresses: [],
      titles: [],
      listing: [],
      userIDs: [],
      recievedSearch: [],
      prices: [],
      rating: []
    };

    this.handleClick = this.handleClick.bind(this);
  },
  handleClick: function(items) {
    this.props.history.push({
      pathname: "/reservations",
      state: {
        listing: this.state.userIDs[items],
        recievedSearch: this.state.recievedSearch
      }
    });
  },

  componentWillMount: function() {
    var recievedSearch = this.props.location.state.message;
    this.setState({ recievedSearch: recievedSearch });

    this.userRef = firebaseRef.ref("listing/");
    this.userRef
      .orderByChild("Address/City")
      .equalTo(recievedSearch)
      .on("child_added", snap => {
        var listing_id = snap.key;
        this.setState({ listing: listing_id });
        var description = firebaseRef
          .ref("listing/" + listing_id + "/Description")
          .on("value", snap => {
            var descrptn = snap.val();
            this.state.descriptions.push(descrptn);
            this.setState({ descriptions: this.state.descriptions });
          });

        this.state.userIDs.push(listing_id);
        this.setState({ userIDs: this.state.userIDs });

        var title = firebaseRef
          .ref("listing/" + listing_id + "/Title")
          .on("value", snap => {
            var title = snap.val();
            this.state.titles.push(title);
            this.setState({ titles: this.state.titles });
          });
        var imageURL = firebaseRef
          .ref("listing/" + listing_id + "/Pictures/imageURL")
          .on("value", snap => {
            var imageURL = snap.val();
            this.state.imageURLs.push(imageURL);
            this.setState({ imageURLs: this.state.imageURLs });
          });
        var price = firebaseRef
          .ref("listing/" + listing_id + "/Price")
          .on("value", snap => {
            var price = snap.val();
            this.state.prices.push(price);
            this.setState({ price: this.state.prices });
          });
        firebaseRef
          .ref("listing/" + listing_id + "/Rating")
          .on("value", snap => {
            var rating = snap.val();
            this.state.rating.push(rating);
            this.setState({ rating: this.state.rating });
          });
      });
    var listUserIDs = [];
    var listPrices = [];
    var listDescriptions = [];
    var listTitles = [];
    var listImageURL = [];
    var maxPrice = this.props.location.state.maxPrice;
    var minPrice = this.props.location.state.minPrice;
    if (minPrice == "" || minPrice == null) minPrice = 0;
    if (maxPrice == "" || maxPrice == null) maxPrice = 999999999;
    for (var i = 0; i < this.state.prices.length; i++) {
      if (
        this.state.prices[i] >= minPrice &&
        this.state.prices[i] <= maxPrice
      ) {
        listUserIDs.push(this.state.userIDs[i]);
        listPrices.push(this.state.prices[i]);
        listDescriptions.push(this.state.descriptions[i]);
        listTitles.push(this.state.titles[i]);
        listImageURL.push(this.state.imageURLs[i]);
      }
    }

    var tempUserIDs = [];
    var tempPrices = [];
    var tempDescriptions = [];
    var tempTitles = [];
    var tempImageURL = [];
    var counter = -1;
    if (this.props.location.state.sortValue == "Sort by Highest Price") {
      for (var i = 0; i < listPrices.length; i++) {
        listPrices[i] *= -1;
      }
    }
    var currentLowest = listPrices[0];
    while (tempPrices == null || tempPrices.length < listPrices.length) {
      for (var i = 0; i < listPrices.length; i++) {
        if (listPrices[i] <= currentLowest && listPrices[i] != 0) {
          currentLowest = listPrices[i];
          counter = i;
        }
      }
      tempUserIDs.push(listUserIDs[counter]);
      tempPrices.push(Math.abs(listPrices[counter]));
      tempDescriptions.push(listDescriptions[counter]);
      tempTitles.push(listTitles[counter]);
      tempImageURL.push(listImageURL[counter]);
      listPrices[counter] = 0;
      currentLowest = 50000;
      counter = -1;
    }
    this.setState({
      userIDs: tempUserIDs,
      prices: tempPrices,
      descriptions: tempDescriptions,
      titles: tempTitles,
      imageURLs: tempImageURL
    });
  },

  render() {
    const styles = {
      sidebarnav: {
        position: "absolute",
        top: 0,
        width: "250px",
        margin: 0,
        padding: 0,
        liststyle: "none"
      },
      sidebar: {
        width: 256,
        height: "100%"
      },
      sidebarLink: {
        display: "block",
        padding: "16px 0px",
        color: "#757575",
        textDecoration: "none"
      },
      divider: {
        margin: "8px 0",
        height: 1,
        backgroundColor: "#757575"
      },
      content: {
        padding: "16px",
        height: "100%",
        backgroundColor: "black"
      }
    };
    var showListings;
    if (this.state.userIDs.length === 0) {
      showListings = (
        <div>
          <center>We currently have no Listings yet!</center>
        </div>
      );
    } else {
      showListings = this.state.descriptions.map((descriptions, items) => (
        <div className="container" key={items}>
          <div className="card" style={{ padding: "20px" }}>
            <div
              className="input-group "
              onClick={evt => this.handleClick(items, evt)}
            >
              <img
                className="card col-sm-7 card-style"
                src={this.state.imageURLs[items]}
                alt=""
                width="350"
                height="270"
              />
              <div>
                <h5 className="card-title pr-3" style={{ padding: "10px" }}>
                  {this.state.titles[items]}
                </h5>
                <footer className="card-text" style={{ padding: "10px" }}>
                  {descriptions}
                </footer>
                <Rating rate={this.state.rating[items]} />
                <h6 style={{ padding: "10px" }}>
                  Price per Night: ${this.state.prices[items]}
                </h6>
              </div>
            </div>
          </div>{" "}
          <br />
        </div>
      ));
    }
    return (
      <div id="wrapper">
        <div id="sidebar-wrapper">
          <ul className="sidebar-nav">
            <li className="sidebar-brand">
              <Filter2 />
            </li>
          </ul>
        </div>
        <div id="page-content-wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">{showListings}</div>
            </div>
          </div>
          <footer>
            <a href="#" style={{ float: "right" }}>
              Back to Top
            </a>
          </footer>
        </div>
      </div>
    );
  }
});
module.exports = withRouter(Listings2);