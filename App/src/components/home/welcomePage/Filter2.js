import React, { Component } from 'react'
import {browserHistory} from 'react-router';
import {withRouter} from "react-router-dom";
import Autosuggest from 'react-autosuggest'


const theme = {
  container: {
    position: 'relative'
  },
  input: {
    float: "left",
    width: '100%',
    height: 25,
    padding: '30px 20px',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 18,
    border: '1px solid #aaa',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  inputFocused: {
    outline: 'none'
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  suggestionsContainer: {
    display: 'none'
  },
  suggestionsContainerOpen: {
    display: 'block',
    position: 'absolute',
    top: 51,
    width: 280,
    border: '1px solid #aaa',
    backgroundColor: '#fff',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 2
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  suggestion: {
    cursor: 'pointer',
    padding: '10px 20px'
  },
  suggestionHighlighted: {
    backgroundColor: '#ddd'
  }
};

const languages = [
  {
    name: 'San Jose'
  },
  {
    name: 'San Francisco'
  },
  {
    name: 'Daly City'
  },
  {
    name: 'Santa Clara'
  },
  {
    name: 'Cupertino'
  },
  {
    name: 'Sunnyvale'
  },
  {
    name: 'Palo Alto'
  }
];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter(language => regex.test(language.name));
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

export default class Filter2 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      suggestions: [],      
      value: this.props.location.state.message,
      show: false,
      minPrice: this.props.location.state.minPrice,
      maxPrice: this.props.location.state.maxPrice,
      sortValue: this.props.location.state.sortValue,      
    };
    this.handleChangeSort = this.handleChangeSort.bind(this);    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChangeMaxPrice = this.handleChangeMaxPrice.bind(this);
    this.handleChangeMinPrice = this.handleChangeMinPrice.bind(this);
  }
  handleClick() {
    if(this.state.value !== "" && this.state.value !== null) {
      this.props.history.push({pathname: '/searchedlistings', state: { message: this.state.value, minPrice: this.state.minPrice, maxPrice:this.state.maxPrice, sortValue:this.state.sortValue,}});
    }
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
    });
  }

  handleChangeMaxPrice(event) {
    this.setState({
      maxPrice: event.target.value,
    });
  }

  handleChangeMinPrice(event) {
    this.setState({
      minPrice: event.target.value,
    });
  }
  handleChangeSort(event) {
    this.setState({
      sortValue: event.target.value,
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      value: '',
      show: true,
    })
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  

  render () {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Type a city to search",
      value,
      onChange: this.onChange
    };
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="card" style={{padding: "20px", margin: "10px"}}>
            <span className="input-group-addon" style={{background: "white",  fontsize: "18px", color: "#1995dc", border: "none"}}>Search By City:</span>
            <Autosuggest
              className="form-control"
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              theme={theme}
              type="text" 
              value={this.state.value}
              onChange={this.handleChange}
            />

            <hr/>
            <span style={{padding: "1px"}}> </span> 
            <span className="input-group-addon" style={{background: "white", color: "#1995dc", border: "none"}}>Type the Price:</span>

            <input
              type="text" className="form-control" placeholder="Min"
              value={this.state.minPrice}
              onChange={this.handleChangeMinPrice}
            />
            <span style={{padding: "1px"}}> </span>


            <input
              type="text" className="form-control" placeholder="Max"
              value={this.state.maxPrice}
              onChange={this.handleChangeMaxPrice}
            />

            <span style={{padding: "1px"}}> </span>      
            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              onClick={(this.state.value === "" || this.state.value === null)? () => alert('You need to enter something to search!') : this.handleClick}  >Filter
            </button>
          </div>
          <br/>
          <br/>
          <div className="card" style={{padding: "20px", margin: "10px"}}>
            <select  style={{border: "1px solid lighblack", float: "left", height: "50px", width: "100%"}} defaultValue={this.state.sortValue} onChange={this.handleChangeSort}>
              <option value="Sort by Lowest Price">Lowest Price</option>
              <option  value="Sort by Highest Price">Highest Price</option>
            </select>
            <br/>
            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              onClick={(this.state.value === "" || this.state.value === null)? () => alert('You need to enter something to search!') : this.handleClick}   >Sort
            </button>
          </div>
        </form>
        <br/>
      </div>
    )
  }
}

module.exports = withRouter(Filter2);
