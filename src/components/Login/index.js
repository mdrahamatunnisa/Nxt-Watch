import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {
  LoginBgContainer,
  LoginContainer,
  LogoImage,
  InputLabel,
  InputBox,
  InputLabelSP,
  LoginButton,
  ErrorMessage,
} from './LoginStyles'
import NxtWatchContext from '../../Context/NxtWatchContext'

class Login extends Component {
  state = {
    showPassword: false,
    username: 'rahul',
    password: 'rahul@2021',
    loginErrorMsg: '',
  }

  togglePasswordDisplay = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }))
  }

  updateUsername = event => {
    this.setState({username: event.target.value})
  }

  updatePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitFailure = loginErrorMsg => {
    this.setState({loginErrorMsg})
  }

  render() {
    const {showPassword, username, password, loginErrorMsg} = this.state
    const getJwtToken = Cookies.get('jwt_token')
    if (getJwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <NxtWatchContext.Consumer>
        {value => {
          const {darkTheme} = value

          const passwordDisplayType = showPassword ? 'text' : 'password'

          const logoUrl = darkTheme
            ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png'
            : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png'

          const onSubmitSuccess = jwtToken => {
            Cookies.set('jwt_token', jwtToken, {
              expires: 30,
            })

            const {history} = this.props

            history.replace('/')
          }

          const submitClicked = async event => {
            event.preventDefault()
            const userDetails = {
              username,
              password,
            }
            const url = 'https://apis.ccbp.in/login'
            const options = {
              method: 'POST',
              body: JSON.stringify(userDetails),
            }

            const response = await fetch(url, options)
            const data = await response.json()

            if (response.ok) {
              const jwtToken = data.jwt_token
              onSubmitSuccess(jwtToken)
            } else {
              this.onSubmitFailure(data.error_msg)
            }
          }

          return (
            <LoginBgContainer darkTheme={darkTheme} data-testid="banner">
              <LoginContainer darkTheme={darkTheme} onSubmit={submitClicked}>
                <LogoImage src={logoUrl} alt="website logo" />
                <br />
                <InputLabel darkTheme={darkTheme} htmlFor="usernameInput">
                  USERNAME
                </InputLabel>
                <InputBox
                  type="text"
                  placeholder="Username:rahul"
                  darkTheme={darkTheme}
                  value={username}
                  onChange={this.updateUsername}
                  id="usernameInput"
                />
                <InputLabel darkTheme={darkTheme} htmlFor="passwordInput">
                  PASSWORD
                </InputLabel>
                <InputBox
                  type={passwordDisplayType}
                  placeholder="Password:rahul@2021"
                  darkTheme={darkTheme}
                  value={password}
                  onChange={this.updatePassword}
                  id="passwordInput"
                />
                <div>
                  <input
                    type="checkbox"
                    id="showPassword"
                    onChange={this.togglePasswordDisplay}
                  />
                  <InputLabelSP htmlFor="showPassword" darkTheme={darkTheme}>
                    Show Password
                  </InputLabelSP>
                </div>
                <LoginButton type="submit">Login</LoginButton>
                <ErrorMessage>{loginErrorMsg}</ErrorMessage>
                <InputLabelSP darkTheme={darkTheme}>
                  Sample Credentials are loaded here!
                </InputLabelSP>
              </LoginContainer>
            </LoginBgContainer>
          )
        }}
      </NxtWatchContext.Consumer>
    )
  }
}
export default Login
