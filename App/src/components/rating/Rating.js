import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
//import Listings from './../home/welcomePage/Listings'
//import Listings2 from './../home/welcomePage/Listings2'


export default class Rating extends React.Component {

    render() {
        return (
            <div style={{padding: "10px"}}>
                <StarRatingComponent
                    name="rate1"
                    starCount={5}
                    value={parseInt(this.props.rate, 10)}
                />
            </div>
        );
    }
}
