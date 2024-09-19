


import { Token, StripeError } from "@stripe/stripe-js";
import "./BillingForm.css";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { userFormFields } from "../lib/hooksLib";
import { useState } from "react";
import LoaderButton from "./LoaderButton";
import { Form } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";

export interface BillingFormType {
  isLoading: boolean,
  onSubmit: (
    storage: string,
    info: { token?: Token; error?: StripeError }
  ) => Promise<void>;
}

const BillingForm = ({isLoading, onSubmit}: BillingFormType) => {
  const stripe = useStripe();
  const elements = useElements();
  const [fields, handleFieldChange] = userFormFields({
    name: "",
    storage: "",
});

const [isProcessing, setIsProcessing] = useState(false);
const [isCardComplete, setIsCardComplete] = useState(false);

isLoading = isProcessing || isLoading;

const validateForm = () => {
  return (
    stripe &&
    elements &&
    fields.name !== "" &&
    fields.storage != "" &&
    isCardComplete
  );
}

const handleSubmitClick = async (event: React.FormEvent<HTMLFormElement>) => {
  event?.preventDefault();

  if (!stripe || ! elements){
    //Stripe.js has not loaded yet. Make sure to disable 
    //form submission until stripe.js has loaded
    return;
  }

  setIsProcessing(true);

  const cardElement = elements.getElement(CardElement);

  if(!cardElement){
    return;
  }

  const { token, error } = await stripe.createToken(cardElement);

  setIsProcessing(false);

  onSubmit(fields.storage, {token, error });

}

return (
  <Form className="BillingForm" onSubmit={handleSubmitClick}>
    <Form.Group controlId="storage">
      <Form.Label>Storage</Form.Label>
      <Form.Control
        min="0"
        size="lg"
        type="number"
        value={fields.storage}
        onChange={handleFieldChange}
        placeholder="Number of notes to store"
      />
    </Form.Group>
    <hr />
    <Stack gap={3}>
      <Form.Group controlId="name">
        <Form.Label>Cardholder&apos;s name</Form.Label>
        <Form.Control
          size="lg"
          type="text"
          value={fields.name}
          onChange={handleFieldChange}
          placeholder="Name on the card"
        />
      </Form.Group>
      <div>
        <Form.Label>Credit Card Info</Form.Label>
        <CardElement
          className="card-field"
          onChange={(e) => setIsCardComplete(e.complete)}
          options={{
            style: {
              base: {
                fontSize: "16px",
                fontWeight: "400",
                color: "#495057",
                fontFamily: "'Open Sans', sans-serif",
              },
            },
          }}
        />
      </div>
      <LoaderButton
        size="lg"
        type="submit"
        isLoading={isLoading}
        disabled={!validateForm()}
      >
        Purchase
      </LoaderButton>
    </Stack>
  </Form>
);
}

export default BillingForm;