import React, { useState } from "react";
import Stack from "react-bootstrap/Stack";
import LoaderButton from "../components/LoaderButton";
import Form from "react-bootstrap/Form";
import { userFormFields } from "../lib/hooksLib";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";
import { Auth } from "aws-amplify";
import "./Signup.css";
import { onError } from "../lib/errorLib";
import { ISignUpResult } from "amazon-cognito-identity-js";

const Signup = () => {
  const [fields, handleFieldChange] = userFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });

  const nav = useNavigate();
  const {userHasAuthenticated} = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState<null | ISignUpResult>(null);

  const validateForm = () => {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  const validateConfirmationForm = () => {
    return fields.confirmationCode.length > 0;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  }

  const handleConfirmationSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) =>{
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  const renderConfirmationForm = () =>{
    return (
      <Form onSubmit={handleConfirmationSubmit}>
      <Stack gap={3}>
          <Form.Group controlId="confirmationCode">
            <Form.Label>Confirmation Code</Form.Label>
            <Form.Control 
              autoFocus
              size="lg"
              type="tel"
              value={fields.confirmationCode}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Text muted>Please check your email for the code.</Form.Text>
          <LoaderButton
            size="lg"
            type="submit"
            variant="success"
            isLoading={isLoading}
            disabled={!validateConfirmationForm()}
          >
            Verify
          </LoaderButton>
      </Stack>
    </Form>
    );
  }

  const renderForm =() => {
    return (
      <Form onSubmit={handleSubmit}>
        <Stack gap={3}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              size="lg"
              autoFocus
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
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              onChange={handleFieldChange}
              value={fields.confirmPassword}
            />
          </Form.Group>
          <LoaderButton
            size="lg"
            type="submit"
            variant="success"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Signup
          </LoaderButton>
        </Stack>
      </Form>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}

export default Signup;