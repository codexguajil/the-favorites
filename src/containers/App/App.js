import React, { Component } from 'react';
import { fetchData } from '../../utils/fetch'
import { key } from '../../utils/apiKEY';
import { cleanMovieData } from '../../utils/helpers';
import { connect } from 'react-redux';
import { addAllMovies, addAllShows, logOutUser, addMessage } from '../../actions';
import MovieContainer from '../MovieContainer/MovieContainer';
import ShowsContainer from '../ShowsContainer/ShowsContainer';
import MovieDetails from '../../components/MovieDetails/MovieDetails';
import Nav from '../../components/Nav/Nav'
import Favorites from '../Favorites/favorites';
import { Route } from 'react-router-dom';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import propTypes from 'prop-types';

export class App extends Component {
  componentDidMount = () => {
    this.fetchMovies()
    this.fetchTv();
  }
  
  fetchMovies = async () => {
    let url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${key}&page=${1}`;
    try {
      let allMovies = await fetchData(url);
      let cleanData = cleanMovieData(allMovies);
      this.props.addAllMovies(cleanData);
    } catch(error) {
      this.props.addMessage(error.message)
      setTimeout(() => {
        this.props.addMessage('')
      }, 3000)
    }
  }

  fetchTv = async () => {
    const url = `https://api.themoviedb.org/3/trending/tv/day?api_key=${key}`;
    try {
      const allShows = await fetchData(url);
      const cleanData = cleanMovieData(allShows);
      this.props.addAllShows(cleanData);
    } catch(error) {
      this.props.addMessage(error.message)
      setTimeout(() => {
        this.props.addMessage('')
      }, 3000)
    }
  }

  render() {
    const {message} = this.props
    return (
      <div className="App">
        <header>
          <Nav />
          <h1>THE FAVORITES</h1>
          <Route exact path='/login' component={SignIn} />
          <Route exact path='/signup' component={SignUp} />
        </header>
        <p className='message'>{message}</p>
        <Route exact path='/favorites' component={Favorites} />
        <Route exact path="/" render={() => (
          <div>
            <h2 className="sub-header">Recommended Movies</h2>
            <h3 className="hint-header">(scroll for more content)</h3>
            <MovieContainer />
            <h2 className="sub-header">Recommended TV Shows</h2>
            <ShowsContainer />
          </div>
        )} />
        <Route path='/details/:id' render={({ match }) => {
          const { id } = match.params
          const { movies, shows } = this.props
          const allMedia = movies.concat(shows)
          const selectedMovie = allMedia.find(movie => {
            return movie.id == id
          })
          if(selectedMovie) {
            return <MovieDetails {...selectedMovie} />
          }
        }} />
      </div>
    )
  }
}

export const mapDispatchToProps = (dispatch) => ({
  addAllMovies: (movies) => dispatch(addAllMovies(movies)),
  addAllShows: (shows) => dispatch(addAllShows(shows)),
  logOutUser: (user) => dispatch(logOutUser()),
  addMessage: (message) => dispatch(addMessage())
})

export const mapStateToProps = (state) => ({
  shows: state.shows,
  movies: state.movies,
  user: state.user.name,
  message: state.message
})

export default connect(mapStateToProps, mapDispatchToProps)(App);

App.propTypes = {
  shows: propTypes.array,
  movies: propTypes.array,
  user: propTypes.string,
  message: propTypes.string,
  addAllMovies: propTypes.func,
  addAllShows: propTypes.func,
  logOutUser: propTypes.func,
  addMessage: propTypes.func
}