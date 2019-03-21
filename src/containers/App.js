import React, { Component } from 'react';
import '../styles/App.css';
import { fetchData } from '../utils/fetch'
import { key } from '../utils/apiKEY';
import { cleanMovieData } from '../utils/helpers';
import { connect } from 'react-redux';
import { addAllMovies } from '../actions';
import MovieContainer from './MovieContainer';
import { NavLink, Route } from 'react-router-dom';
import SignIn from './SignIn';
import SignOut from './SignOut';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: ''
    }
  }

  componentDidMount = () => {
    this.fetchMovies()
  }
  
  fetchMovies = async () => {
    const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${key}`;
    const allMovies = await fetchData(url);
    const cleanData = cleanMovieData(allMovies);
    this.props.addAllMovies(cleanData);
  }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        <header>
          <NavLink to='/login' className="nav">Log In</NavLink>
          <h1>Movie Tracker</h1>
          {
          this.props.user &&
            <div>
              <p>Welcome back!</p>
              <SignOut />
            </div>
          }
        </header>
        <Route exact path='/' component={MovieContainer} />
        <Route exact path='/login' component={SignIn} />
      </div>
    );
  }
}

export const mapDispatchToProps = (dispatch) => ({
  addAllMovies: (movies) => dispatch(addAllMovies(movies))
})

export const mapStateToProps = (state) => ({
  user: state.user.name
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
