import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";

function LoginView() {
  const dispatch = useDispatch();
  const [inputValues, setInputValue] = useState({
    email: "",
    password: "",
  });

  const [validation, setValidation] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  //handle submit updates
  function handleChange(event) {
    const { name, value } = event.target;
    setInputValue({ ...inputValues, [name]: value });
  }

  const checkValidation = () => {
    let errors = validation;

    // email validation
    const emailCond = RegExp(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );
    if (!inputValues.email.trim()) {
      errors.email = "Email is required";
    } else if (!inputValues.email.match(emailCond)) {
      errors.email = "Please ingress a valid email address";
    } else {
      errors.email = "";
    }
    //password validation
    const password = inputValues.password;
    if (!password) {
      errors.password = "password is required";
    } else {
      errors.password = "";
    }
    setValidation(errors);
  };

  useEffect(() => {
    checkValidation();
  }, [inputValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm(validation)) {
      fetch("https://reqres.in/api/login", {
        method: "POST",
        body: JSON.stringify({
          email: inputValues.email,
          password: inputValues.password,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then(async (res) => {
          if (res.ok) {
            return res.json();
          } else {
            const data = await res.json();
            let errorMessage = "Authentication failed.";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          }
        })
        .then((data) => {
          localStorage.setItem("token", data.token);
          dispatch(authActions.login());
          navigate("/dashbord", { replace: true });
        })
        .catch((err) => {
          alert(err.message);
        });
    } else {
      console.log("Invalid form");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign In</h3>
      <div className="mb-3">
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="Email Address"
          onChange={(e) => handleChange(e)}
          value={inputValues.email}
        />
        {validation.email && <p>{validation.email}</p>}
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          name="password"
          placeholder="Password"
          onChange={(e) => handleChange(e)}
          value={inputValues.password}
          required
          noValidate
        />
        {validation.password && <p>{validation.password}</p>}
      </div>
      <div className="mb-3">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
          />
          <label className="custom-control-label" htmlFor="customCheck1">
            Check me out
          </label>
          <p className="forgot-password text-right">
            <a href="/forgot-password">Forgot Password?</a>
          </p>
        </div>
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
      <p className="forgot-password text-center">
        Don't have an account <a href="/sign-up">sign up</a>
      </p>
    </form>
  );
}
export default LoginView;
