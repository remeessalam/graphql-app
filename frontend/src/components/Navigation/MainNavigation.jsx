import { NavLink } from "react-router-dom";
import "./MainNavigation.css";
import AuthContext from "../../context/auth-context";
import { useContext } from "react";

const MainNavigation = () => {
  const user = useContext(AuthContext);
  console.log("this is user =", user);
  return (
    <AuthContext.Consumer>
      {(context) => {
        console.log("this is constext = ", context);
        return (
          <header className="main-navigation">
            <div className="main-naviagation__logo">
              <h1>Navbar</h1>
            </div>
            <div className="main-navigation_items">
              <ul>
                {!context.token && (
                  <li>
                    <NavLink to="/auth">Authenticate</NavLink>
                  </li>
                )}
                <li>
                  <NavLink to="/">Events</NavLink>
                </li>
                {context.token && (
                  <>
                    <li>
                      <NavLink to="/bookings">Bookings</NavLink>
                    </li>

                    <li>
                      <button onClick={context.logout}>Logout</button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default MainNavigation;
