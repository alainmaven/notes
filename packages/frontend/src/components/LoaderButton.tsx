import Button from "react-bootstrap/Button";
import { BsArrowRepeat } from "react-icons/bs";
import "./LoaderButton.css";


const LoaderButton = ({
  className= "",
  disabled = false,
  isLoading = false,
  ...props
}) => {
  return (
    <Button 
      disabled={disabled || isLoading}
      className={`LoaderButton ${className}`}
      {...props}
    >
      {isLoading && <BsArrowRepeat className="spinning" />}
      {props.children}
    </Button>
  );
}

export default LoaderButton;