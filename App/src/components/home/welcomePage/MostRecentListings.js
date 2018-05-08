import React from 'react';
import {firebaseRef} from './../../../constants/constants';
import {browserHistory} from 'react-router';
import {withRouter} from "react-router-dom";
import Rating from './../../rating/Rating';

//parent class listing
var Listings = React.createClass({

  getInitialState: function(){
		return {
      val: this.stateVal,
      imageURLs: [],
      descriptions: [],
      addresses: [],
      titles: [],
      list1: [], 
      list2: [],
      recievedSearch:[],
      prices: [],

      imageURLsList2: [],
      descriptionsList2: [],
      addressesList2: [],
      titlesList2: [],
      pricesList2: [],
      ratingList1: [],
      ratingList2: [],
    };
  },
  
  handleClick: function(list, items) {
    console.log(list);
    
    this.props.history.push({pathname: '/reservations', state: { listing: list, recievedSearch: this.state.recievedSearch}  });
  },
  

  componentWillMount: function(){
    // most recent posting
    firebaseRef.ref('listing/').limitToFirst(5).on("child_added", snap=>{
      firebaseRef.ref("listing/" + snap.key).on("value", snap => {
        var atributeListKey = snap.key;
        var atributeListVal = snap.val();
        var list1 = snap.key
        this.state.list1.push(list1);
        this.setState({list1: this.state.list1});

        this.state.descriptions.push(snap.val().Description);
        this.setState({descriptions: this.state.descriptions});
  
        this.state.titles.push(snap.val().Title);
        this.setState({titles: this.state.titles})
  
        this.state.imageURLs.push(snap.val().Pictures.imageURL);
        this.setState({imageURLs: this.state.imageURLs});
  
        this.state.prices.push(snap.val().Price);
        this.setState({prices: this.state.prices});

        this.state.ratingList1.push(snap.val().Rating);
        this.setState({ratingList1: this.state.ratingList1});
     

      });

    });
    // postings lower then $100
    firebaseRef.ref('listing/').limitToFirst(10).on("child_added", snap=>{
      firebaseRef.ref("listing/" + snap.key).limitToFirst(10).on("value", snap => {
        var atributeListKey = snap.key;
        var atributeListVal = snap.val();
  
        if (snap.val().Price < 100 ) {

          var list2 = snap.key;
          this.state.list2.push(list2);
          this.setState({list2: this.state.list2});

          this.state.descriptionsList2.push(snap.val().Description);
          this.setState({descriptionsList2: this.state.descriptionsList2});
  
          this.state.titlesList2.push(snap.val().Title);
          this.setState({titlesList2: this.state.titlesList2})
  
          this.state.imageURLsList2.push(snap.val().Pictures.imageURL);
          this.setState({imageURLsList2: this.state.imageURLsList2});
  
          this.state.pricesList2.push(snap.val().Price);
          this.setState({pricesList2: this.state.pricesList2});

          this.state.ratingList2.push(snap.val().Rating);
          this.setState({ratingList2: this.state.ratingList2});
     
  
        }
      });
    });

  },


  render() {
    var showListings;
    if(this.state.list1.length === 0){
			showListings = <div><center>We currently have no Listings yet!</center></div>
		} else {
    showListings =
			this.state.descriptions.map((descriptions,items) => (
          <div className="carosel" key={items} onClick={(evt) =>this.handleClick(this.state.list1[items],items,evt)}>
            <img src={this.state.imageURLs[items]} alt="" width="190" height="270" />
            <center><h6 className="card-title">{this.state.titles[items]}</h6>
              <h7>Only ${this.state.prices[items]} per night</h7>  
              <Rating rate={this.state.ratingList1[items]}/>

            <button href="#" className="btn btn-outline-warning btn-block"  onClick={(evt) =>this.handleClick(items,evt)}> See Details! </button></center>
          </div>
   			))
    }
    var cheapest;
    if(this.state.list2.length === 0){
			cheapest = <div><center>We currently have no Listings yet!</center></div>
		} else {
    cheapest =
			this.state.descriptionsList2.map((descriptionsList2,items) => (
          <div className="carosel" key={items} onClick={(evt) =>this.handleClick(this.state.list2[items],items,evt)}>
            <img src={this.state.imageURLsList2[items]} alt="" width="190" height="270" />
            <center><h6 className="card-title">{this.state.titlesList2[items]}</h6>
              <h7>Only ${this.state.pricesList2[items]} per night</h7> 
              <Rating rate={this.state.ratingList2[items]}/>
 
            <button href="#" className="btn btn-outline-warning btn-block"  onClick={(evt) =>this.handleClick(items,evt)}> See Details! </button></center>
          </div>
   			))
    }
    return (
      <div className="container">
        <h4>Most Recent Postings </h4><br/>
        <div className="row">
        {showListings}
        </div>
        <br/><br/>
        <h4>Rooms under $100 </h4><br/>
        <div className="row">
        <br/>
        {cheapest}
        </div>
        <br/>
        <br/>
        <footer>
          <a href="#" style={{float: "right"}} >Back to Top</a>
        </footer>
      </div>
    );
  }
});
module.exports = withRouter(Listings);
{/*
firebaseRef.ref('listing/').limitToFirst(5).on("child_added", snap=>{
      


      firebaseRef.ref('listing/'+ snap.key).limitToFirst(5).on("values", snap=>{
        var atributeListKey = snap.key;
        var atributeListVal = snap.val();
  
  
        this.state.descriptions.push(snap.val().Description);
        this.setState({descriptions: this.state.descriptions});
  
        this.state.titles.push(snap.val().Title);
        this.setState({titles: this.state.titles})
  
        this.state.imageURLs.push(snap.val().Pictures.imageURL);
        this.setState({imageURLs: this.state.imageURLs});
  
        this.state.prices.push(snap.val().Price);
        this.setState({prices: this.state.prices});
  
      });
    });


*/}