import React, { Component } from 'react';
import '../styles/App.css';
import { fetchData } from '../utils/fetch'
import { key } from '../utils/apiKEY';
import { cleanMovieData } from '../utils/helpers';

class App extends Component {

  componentDidMount = () => {
    this.fetchMovies()
  }
  
  fetchMovies = async () => {
    const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${key}`;
    const allMovies = await fetchData(url);
    const cleanData = cleanMovieData(allMovies);
    console.log(cleanData);
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Movie Tracker</h1>
        </header>
      </div>
    );
  }
}

export default App;
