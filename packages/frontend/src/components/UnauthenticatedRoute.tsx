import { cloneElement, ReactElement } from "react";
import { useAppContext } from "../lib/contextLib";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactElement;
}

function queryString(name: string, url = window.location.href) {
  const parseName = name.replace(/[[]]/g,"\\$&");
  const regex = new RegExp(`[?&]${parseName}(=([^&#]*)|&|#|$)`, "i");
  const results = regex.exec(url);

  if (!results || !results[2]){
    return false;
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "))
}

export default function UnauthenticatedRoute (props: Props): ReactElement{
  const { isAuthenticated } = useAppContext();
  const { children } = props;
  const redirect = queryString("redirect");

  if (isAuthenticated) {
    return <Navigate to={redirect || "/"} />
  }

  return cloneElement(children, props);
}