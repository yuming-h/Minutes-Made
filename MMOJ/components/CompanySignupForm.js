import { Component, Fragment } from "react";
import { Form } from "semantic-ui-react";

const formStyle = {
  marginLeft: "100px"
};

export default class CompanySignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  handleSubmit = async event => {
    event.preventDefault();
  };

  render() {
    return (
      <div style={formStyle}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Full Name</label>
            <input type="text" placeholder="Name" name="name" />
          </Form.Field>
        </Form>
      </div>
    );
  }
}
