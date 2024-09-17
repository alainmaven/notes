import { useState } from "react";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import "./Login.css"
import { Auth } from "aws-amplify";
import { useAppContext } from "../lib/contextLib";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../lib/errorLib";
import { userFormFields } from "../lib/hooksLib";

const Login = () => {
  const [fields, handleFieldChange] = userFormFields({
    email: "",
    password: "",
  });
  const { userHasAuthenticated } = useAppContext();
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    return fields.email.length > 0 && fields.password.length > 0
  }



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      nav("/");
    } catch (error) {
      onError(error);

      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Stack gap={3}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              size="lg"
              type="email"
              value={fields.email}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              value={fields.password}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <LoaderButton 
          size="lg" 
          type="submit" 
          disabled={!validateForm()}
          isLoading={isLoading}
          >
            Login
          </LoaderButton>
        </Stack>
      </Form>
    </div>
  );
}

export default Login;