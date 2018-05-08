import React, { Component } from 'react'
import { browserHistory } from "react-router";
import { withRouter } from "react-router-dom";
import ReactModal from "react-modal";

export default class PayNowOrLater extends Component {
      
  constructor(props) {
    super(props);

    this.state = {
        prices: [],
        checkIn: [],
        checkOut:[],
        showModal: true,
    };
    this.handleSubmitNow = this.handleSubmitNow.bind(this);
    this.handleSubmitLater = this.handleSubmitLater.bind(this);
  }
  componentWillMount() {
    // set the price in the state
    var prices = this.props.location.state.prices;
    this.state.prices.push(prices);
    this.setState({prices: this.state.prices});
    
    //set up the checkIn in the state
    var checkIn = this.props.location.state.checkIn
    this.state.checkIn.push(checkIn);
    this.setState({checkIn: this.state.checkIn});
  // set up the checkOut in the state
    var checkOut = this.props.location.state.checkOut
    this.state.checkOut.push(checkOut);
    
    this.setState({checkOut: this.state.checkOut});
    
    
  }
  handleSubmitNow () {
    this.setState({ showModal: false });
    this.props.history.push({pathname: '/payments', state: { prices: this.state.prices, checkIn: this.state.checkIn, checkOut: this.state.checkOut} });
    
  }
  handleSubmitLater () {
    this.setState({ showModal: false });
    this.props.history.push({pathname: '/'});
    
  }

  render() {
    
    return (
      <div className="container" style={{padding: "70px"}}>
        <ReactModal
          isOpen={this.state.showModal}
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
            <h3 style={{color: "black"}}>When do you want to pay?</h3>
            <br/>
          </center>
          <center>
            <button
              className="btn btn-secondary btn-lg px-4"
              style={{ margin: "10px" }}
              onClick={this.handleSubmitLater}
            >
              Later
            </button>
            <button
              className="btn btn-warning secondary btn-lg px-4"
              style={{ margin: "10px" }}
              onClick={this.handleSubmitNow }
            >
              Now
            </button>
          </center>
        </ReactModal>
      </div>
    );
  }
};
