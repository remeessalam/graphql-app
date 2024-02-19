import { useState } from "react";
import "./Auth.css";
const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submitHandler = (event) => {
    event.preventDefault();
    if (email.trim().length === 0 || password.trim().length === 1) {
      return;
    }
    console.log(email, password);
  };
  return (
    <>
      <form onSubmit={submitHandler} className="auth-form">
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button">Switch to Signup</button>
        </div>
      </form>
    </>
  );
};

export default AuthPage;
