import React from 'react';
import ReactDOM from 'react-dom';
import StarRatingComponent from 'react-star-rating-component';
import {firebaseRef} from './../../constants/constants';
import firebase from 'firebase'
import { withRouter } from "react-router-dom";
import { browserHistory } from "react-router";



export default class Rating extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rating: 0,
            pid: [],
        };
    }

  

    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
        // store the posting id
        var pid = this.props.pid;
        this.state.pid.push(pid);
        this.setState({pid: this.state.pid});

        console.log("rate: "+this.props.pid)
        console.log("here: "+this.state.pid)

    }

    handleRating(){
        this.postRef = firebase.database().ref().child("listing/" + this.props.pid);

        if (firebase.auth().currentUser === null) {
            console.log(" handle click user is not logged in! ");
        } else {
            //update the rated to true so the button disappears
            var user = firebase.auth().currentUser;
            this.userRef = firebase.database().ref().child("users/" + user.uid+"/reservations");
            this.userRef.on("child_added", snap=>{
                if (snap.val().pID == this.props.pid) {
                    console.log("this is a key: "+JSON.stringify(snap.val().rated));
                    console.log("this is a key: "+JSON.stringify(snap.key));
                    
                    firebase.database().ref().child("users/" + user.uid+"/reservations/"+snap.key).update({"rated": true});
                    
                    this.props.history.push({pathname: '/' });
                    
                }
            });
        }



        this.postRef.once("value", snap=>{
            var count = parseInt(snap.val().Count,  10);
            //update the ratingin DB
            if (this.props.pid == snap.key){
                var countUpdate = count+1;
                var rating = Math.round((parseInt(snap.val().Rating, 10)*count+this.state.rating)/(countUpdate));
                
                firebaseRef.ref('listing/'+ this.props.pid).update({"Count": countUpdate});
                firebaseRef.ref('listing/'+ this.props.pid).update({"Rating": rating});
            }

            alert("Rating successful");

            console.log("You rated: "+this.state.rating);  
        });
    }

    render() {
        const { rating } = this.state;
        return (
            <div className="conatiner">
                <center>
                    <StarRatingComponent
                        name="rate1"
                        starCount={5}
                        value={rating}
                        onStarClick={this.onStarClick.bind(this)}
                    />
                </center>
                <a href="/"><button style={{margin: "10px"}} className="btn btn-success" 
                    onClick={this.handleRating.bind(this)}>Give Rate
                </button> </a>
            </div>
        );
    }
}
