import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";
import { ReactElement } from "react";

export default function AuthenticatedRoute({
  children,
}: {
  children: ReactElement,
}): ReactElement {
  const { pathname, search } = useLocation();
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${pathname}${search}`} />;
  }

  return children;
}