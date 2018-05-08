import React, { Component } from 'react';
import {firebaseRef, firebaseStorage} from '../../constants/constants';
import ImageUploader from 'react-firebase-image-uploader';
import { withRouter } from "react-router-dom";
import { browserHistory } from "react-router";


export default class MyRental extends Component {
  constructor(){
    super();
    this.state = {
      title: '',
      street:'',
      city:'',
      state:'',
      country:'',
      zip:'',
      description:'',
      price: '',
      pictures: '',
      uid: '',
      url1: '',
      url2: '',
      url3: '',
      isUploading: false,
      progress: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e){
    this.setState({
      [e.target.name] : e.target.value
  });
}
  handleUploadError=(error)=>{
    this.state.isUploading = false;
    console.error(error);
  }
  handleUploadSuccess = (filename)=>{
    this.state.progress = 100;
    this.state.isUploading = false;
    console.log(this.state);
    this.state.url1 = firebaseStorage.ref('Pictures').child(filename).getDownloadURL().then(function(url) {
      console.log(url);
      return url ;
    }).catch(function(error) {
      // Handle any errors here
    });
    console.log(this.state);
  };
  handleProgress=(progress)=>{
    this.state.progress = progress;
  }
  handleUploadStart=()=>{
    this.state.isUploading = true;
    this.state.progress = 0;
  }
  handleSubmit(e){
    e.preventDefault();
    const listingRef = firebaseRef.ref('listing');
    const listingEach = {
      Title: this.state.title,
      Rating: 5,
      Count: 1,
      Address: {
        Street : this.state.street,
        City : this.state.city,
        Country : this.state.country,
        State : this.state.state,
        Zip : this.state.zip
      },
      Price: this.state.price,
      Description: this.state.description,
      Pictures: {
        imageURL : this.state.url1.za,
        url2 : this.state.url2,
        url3 : this.state.url3,
        isUploading : false,
        progress: 0
      }
    }
    console.log(this.state.url1.za);
    console.log(listingEach.Pictures.imageURL);
    listingRef.push(listingEach);
    alert("Submission successful");
    this.props.history.push({
      pathname: "/"
    });
    this.setState({
      title: '',
      address: {
        street:'',
        city:'',
        state:'',
        country:'',
        zip:''
      },
      description:'',
      price: '',
      pictures: '',
      uid: ''
    });
  
  }

  render() {
    return (
      <div>
        <div className="container">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <fieldset>
              <legend>Add Rental</legend>
              <div className="form-group">
                <label htmlFor="inputTitle" className="col-lg-2 control-label">Title</label>
                <div className="col-lg-10">
                  <input type="text" name="title" className="form-control" placeholder="What your place name?" onChange={this.handleChange} value = {this.state.title}/>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="inputRentalAddress" className="col-lg-2 control-label">Street Address</label>
                <div className="col-lg-10">
                  <input type="text" name="street" className="form-control" onChange={this.handleChange} value={this.state.street}/>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="inputPassword" className="col-lg-2 control-label">City</label>
                <div className="col-lg-10">
                  <input type="text" name="city" className="form-control" onChange={this.handleChange} value={this.state.city}/>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="inputPassword" className="col-lg-2 control-label">State</label>
                <div className="col-lg-10">
                  <input type="text" name="state" className="form-control" onChange={this.handleChange} value={this.state.state}/>
                </div>
                <div className="col-lg-10">
                <label>Picture:</label>
                    {this.state.isUploading &&
                        <p>Progress: {this.state.progress}</p>
                    }
                    {this.state.url1 &&
                        <img src={this.state.url1} />
                    }
                    <ImageUploader
                        name="avatar"
                        storageRef={firebaseStorage.ref('Pictures')}
                        onUploadStart={this.handleUploadStart}
                        onUploadError={this.handleUploadError}
                        onUploadSuccess={this.handleUploadSuccess}
                        onProgress={this.handleProgress}
                    />
                    </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="select" className="col-lg-2 control-label">Country</label>
                <div className="col-lg-10">
                  <input type="text" name="country" className="form-control" onChange={this.handleChange} value={this.state.country}/>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="select" className="col-lg-2 control-label">Price</label>
                <div className="col-lg-10">
                  <input type="text" name="price" className="form-control" onChange={this.handleChange} value={this.state.price}/>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="inputPassword" className="col-lg-2 control-label">Zip</label>
                <div className="col-lg-10">
                  <input type="text" name="zip" className="form-control" onChange={this.handleChange} value={this.state.zip}/>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="textArea" className="col-lg-2 control-label">Description</label>
                <div className="col-lg-10">
                  <textarea className="form-control" rows="3" name="description" onChange={this.handleChange} value={this.state.description}></textarea>
                  <span className="help-block">A longer block of help text that breaks onto a new line and may extend beyond one line.</span>
                </div>
              </div>
 
              <div className="form-group">
                <div className="col-lg-10 col-lg-offset-2">
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>

          <section className='display-item'>
            <div className='wrapper'>
              <ul>
              </ul>
            </div>
          </section>
        </div>
    );
  }
}