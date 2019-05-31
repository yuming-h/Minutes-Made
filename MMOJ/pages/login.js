import Layout from "../components/MyLayout.js";
import { Component } from "react";
import Axios from "axios";

const pageStyle = {
  margin: process.env.DEFAULT_PAGE_MARGINS
};

export default class Login extends Component {
    static getInitialProps ({ req }) {
      //const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  
      const apiUrl = 'http://0.0.0.0:8080/auth/login'

      return { apiUrl }

  }
  constructor(props) {
    super(props);

    this.state = { email: '', error: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event) {
    this.setState({ email: event.target.value })
  }

  async handleSubmit (event) {
    event.preventDefault()
    const loginApi = this.props.apiUrl

    Axios({
      method: 'post',
      url: loginApi,
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: querystring.stringify({
        email: this.state.email,
        pass: this.state.password
      })
    })
    .then(function (response) {
      console.log(response);
      if (response.data.code == 200) {
        console.log("Login Successful");
      
      }
      else if (response.data.code == 204) {
        console.log("Incorrect email or password");
      }
      else {
        console.log("Error logging in")
      }
    })
  }

  render() {
    return (
      <Layout>
        <div style={pageStyle}>
        <div className='login'>
          <form>
            <label htmlFor='email'>Email</label>

            <input
              type='text'
              id='email'
              name='email'
            />
            <label htmlFor='password'>Password</label>
            <input
              type='text'
              id='password'
              name='password'
            />
            <button type='submit'>Login</button>
            <p>
              {}
            </p>
          </form>
        </div>
        <style jsx>{`
          .login {
            max-width: 340px;
            margin: 0 auto;
            padding: 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          form {
            display: flex;
            flex-flow: column;
          }
          label {
            font-weight: 600;
          }
          input {
            padding: 8px;
            margin: 0.3rem 0 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          .error {
            margin: 0.5rem 0 0;
            display: none;
            color: brown;
          }
          .error.show {
            display: block;
          }
        `}</style>
        </div>
      </Layout>
    );
  }
}
