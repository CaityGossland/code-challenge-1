import React, { useReducer, useEffect } from "react";

import { validate } from "../../util/validators";
import "./Select.css";

const selectReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const Select = (props) => {
  const [selectState, dispatch] = useReducer(selectReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onSelect } = props;
  const { value, isValid } = selectState;

  useEffect(() => {
    onSelect(id, value, isValid);
  }, [id, value, isValid, onSelect]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  return (
    <div
      className={`form-control ${
        !selectState.isValid && selectState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <select
        id={props.id}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={selectState.value}
      >
        <option value={"default"} disabled>
          Select a type
        </option>
        {props.options.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>
      {!selectState.isValid && selectState.isTouched && (
        <p>{props.errorText}</p>
      )}
    </div>
  );
};

export default Select;
