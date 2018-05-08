import React, { Component } from 'react'
import {browserHistory} from 'react-router';
import {withRouter} from "react-router-dom";
import FaHome from 'react-icons/lib/fa/search'
import Autosuggest from 'react-autosuggest'


const theme = {
  container: {
    position: 'relative'
  },
  input: {
    width: '100%',
    height: "30px",
    padding: '32px 10px',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 24,
    border: '1px solid lightgray',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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


export default class Search extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      suggestions: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }


  handleClick() {
    if(this.state.value !== "" && this.state.value !== null){
      this.props.history.push({pathname: '/searchedlistings', state: {message: this.state.value, sortValue: "Sort by Lowest Price"}});
    }
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      value: ''
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
      placeholder: "Type city name",
      value,
      onChange: this.onChange
    };

    return (

        <div  className="form-group"  style={{padding: "20px", float: "center"}} onSubmit={this.handleSubmit}>
            <label className="control-label" htmlFor="inputLarge"><h5>Where to Stay</h5></label>
            <div className="input-group " >
              <span className="input-group-addon" style={{border: "1px solid lightgray"}}><FaHome /></span>
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                theme={theme}
                type="text"
                onChange={this.handleChange}
                value={this.state.value}
              />
              <span className="input-group-btn">
                <button className="btn btn-warning" onClick={(this.state.value === "" || this.state.value === null)? () => alert('You need to enter something to search!') : this.handleClick}    >Search</button>
              </span>
            </div>
        </div>





    )
  }
}


module.exports = withRouter(Search);