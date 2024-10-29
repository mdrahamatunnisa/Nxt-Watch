import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import NxtWatchContext from './Context/NxtWatchContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Home from './components/Home'
import Trending from './components/Trending'
import Gaming from './components/Gaming'
import NotFound from './components/NotFound'
import VideoItemDetails from './components/VideoItemDetails'
import SavedVideos from './components/SavedVideos'
import './App.css'

const tabsList = [
  {
    id: 'HOME',
    displayText: 'Home',
    linkAddress: '/',
  },
  {
    id: 'TRENDING',
    displayText: 'Trending',
    linkAddress: '/trending',
  },
  {
    id: 'GAMING',
    displayText: 'Gaming',
    linkAddress: '/gaming',
  },
  {
    id: 'SAVED_VIDEOS',
    displayText: 'Saved Videos',
    linkAddress: '/saved-videos',
  },
]

class App extends Component {
  state = {
    darkTheme: false,
    activeTab: 'HOME',
    displayPremiumContainer: true,
    savedVideosList: [],
    isVideoLiked: false,
    isVideoDisliked: false,
    isVideoSaved: false,
  }

  onClickLikeBtn = () => {
    this.setState(prevState => ({
      isVideoLiked: !prevState.isVideoLiked,
      isVideoDisliked: false,
    }))
  }

  onClickDislikeBtn = () => {
    this.setState(prevState => ({
      isVideoDisliked: !prevState.isVideoDisliked,
      isVideoLiked: false,
    }))
  }

  onClickSaveVideoBtn = videoDetails => {
    const {savedVideosList} = this.state

    const index = savedVideosList.findIndex(each => each.id === videoDetails.id)

    if (index === -1) {
      this.setState(prevState => ({
        savedVideosList: [...prevState.savedVideosList, videoDetails],
        isVideoSaved: true,
      }))
    } else {
      this.setState(prevState => {
        const updatedSavedVideosList = prevState.savedVideosList.filter(
          eachVideo => eachVideo.id !== videoDetails.id,
        )
        return {
          savedVideosList: updatedSavedVideosList,
          isVideoSaved: false,
        }
      })
    }
    console.log(savedVideosList)
  }

  changeTheme = () => {
    this.setState(prevState => ({
      darkTheme: !prevState.darkTheme,
    }))
  }

  updateActiveTab = givenTab => {
    this.setState({
      activeTab: givenTab,
    })
  }

  removePremiumContainer = () => {
    this.setState({
      displayPremiumContainer: false,
    })
  }

  render() {
    const {
      darkTheme,
      activeTab,
      displayPremiumContainer,
      savedVideosList,
      isVideoLiked,
      isVideoDisliked,
      isVideoSaved,
    } = this.state
    return (
      <NxtWatchContext.Provider
        value={{
          darkTheme,
          activeTab,
          tabsList,
          displayPremiumContainer,
          savedVideosList,
          isVideoLiked,
          isVideoDisliked,
          isVideoSaved,
          changeTheme: this.changeTheme,
          updateActiveTab: this.updateActiveTab,
          removePremiumContainer: this.removePremiumContainer,
          onClickLikeBtn: this.onClickLikeBtn,
          onClickDislikeBtn: this.onClickDislikeBtn,
          onClickSaveVideoBtn: this.onClickSaveVideoBtn,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute
            exact
            path="/"
            render={() => <Home updateActiveTab={this.updateActiveTab} />}
          />
          <ProtectedRoute
            exact
            path="/trending"
            render={() => <Trending updateActiveTab={this.updateActiveTab} />}
          />
          <ProtectedRoute
            exact
            path="/gaming"
            render={() => <Gaming updateActiveTab={this.updateActiveTab} />}
          />
          <ProtectedRoute
            exact
            path="/saved-videos"
            render={() => (
              <SavedVideos updateActiveTab={this.updateActiveTab} />
            )}
          />
          <ProtectedRoute
            exact
            path="/videos/:id"
            component={VideoItemDetails}
          />

          <Route
            path="/not-found"
            render={() => <NotFound updateActiveTab={this.updateActiveTab} />}
          />
          <Redirect to="/not-found" />
        </Switch>
      </NxtWatchContext.Provider>
    )
  }
}

export default App
