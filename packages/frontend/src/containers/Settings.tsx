import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BillingType } from "../types/billing";
import { API } from "aws-amplify";
import { loadStripe } from "@stripe/stripe-js";
import config from "../config";
import BillingForm, { BillingFormType } from "../components/BillingForm";
import { onError } from "../lib/errorLib";
import { Elements } from "@stripe/react-stripe-js";
import "./Settings.css";

const stripePromise = loadStripe(config.STRIPE_KEY);

const Settings = () => {
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const billUser = (details: BillingType) => {
    return API.post("notes", "/billing", {
      body: details,
    });
  }

  const handleFormSubmit: BillingFormType["onSubmit"] = async (
    storage,
    info
  ) => {
    if (info.error) {
      onError(info.error);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: info.token?.id,
      });
      alert("Your card has been charge successfully!");
      nav("/");

    } catch (e) {
      onError(e);
      setIsLoading(false);
    }


  }
  return (
    <div className="Settings">
      <Elements
        stripe={stripePromise}
        options={{
          fonts: [
            {
              cssSrc: "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800",
            },
          ],
        }}
      >
        <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
      </Elements>
    </div>
  );

}

export default Settings;