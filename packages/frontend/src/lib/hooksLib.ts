import { ChangeEventHandler, ChangeEvent, useState } from "react";

interface FieldsType {
  [key: string | symbol]: string;
}

export function userFormFields(
  initialState: FieldsType
): [FieldsType, ChangeEventHandler] {
  const [fields, setValues] = useState(initialState);

  return [
    fields, 
    function(event: ChangeEvent<HTMLInputElement>) {
      setValues({
        ...fields,
        [event.target.id]: event.target.value,
      });
      return;
    }
  ];
}