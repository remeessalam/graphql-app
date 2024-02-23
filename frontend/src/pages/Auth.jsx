import { useContext, useState } from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  // const [error, setError] = useState("");
  const login = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(login, "thisis context type");
  const submitHandler = (event) => {
    event.preventDefault();
    if (email.trim().length === 0 || password.trim().length === 1) {
      return;
    }
    console.log(email, password);

    let requestBody = {
      query: `
      query {
        login(email: "${email}", password: "${password}"){
          userId
          token
          tokenExpiration
        }
      }
      `,
    };
    if (isLogin) {
      requestBody = {
        query: `
          mutation{
            createUser(userInput: {email:"${email}", password: "${password}"}){
              _id
              email
            }
        }`,
      };
    }
    fetch("http://localhost:8000/graphql", {
      method: "post",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((res) => {
        console.log(
          "This is response after login or signup :",
          res.data.login.token ? "true" : "false",
          AuthContext
        );
        if (res.data.login.token) {
          login(
            res.data.login.token,
            res.data.login.userId,
            res.data.login.tokenExpiration
          );
          console.log("This is response after login or signup :", AuthContext);
          navigate("/");
        } else {
          console.log("This is response after login or signup :");
          alert("Signup success");
          // if (res.data.createUser.email) {
          //   return;
          // }
        }
      })
      .catch((err) => {
        console.log(err);
        // setError(err);

        // throw new Error("failed");
      });
  };

  const switchModelHandler = () => {
    setIsLogin((pre) => {
      return !pre;
    });
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
          <button type="button" onClick={switchModelHandler}>
            Switch to {!isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AuthPage;
