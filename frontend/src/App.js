import { useState } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/Auth";
import EventPage from "./pages/Event";
import BookingPage from "./pages/Booking";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";
const Error = () => {
  return <h1>Error</h1>;
};
const AppLayout = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };
  const logout = () => {
    setToken(null);
    setUserId(null);
  };
  return (
    <>
      <AuthContext.Provider
        value={{ token: token, userId: userId, login: login, logout: logout }}
      >
        <MainNavigation />
        <Outlet />
      </AuthContext.Provider>
    </>
  );
};

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <EventPage />,
      },
      {
        path: "/booking",
        element: <BookingPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
    errorElement: <Error />,
  },
]);

export default AppRouter;

// function App() {
//   const [token, setToken] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const login = (token, userId, tokenExpiration) => {
//     setToken(token);
//     setUserId(userId);
//   };
//   const logout = () => {
//     setToken(null);
//     setUserId(null);
//   };
//   console.log(token, "thisistoken");
//   return (
//     <BrowserRouter>
//       <>
//         <AuthContext.Provider
//           value={{ token: token, userId: userId, login: login, logout: logout }}
//         >
//           <MainNavigation />
//           <main className="main-content">
//             <Routes>
//               <Route
//                 exact
//                 path="/"
//                 element={token ? <HomePage /> : <AuthPage />}
//               />

//               <Route exact path="/auth" element={<AuthPage />} />

//               <Route exact path="/events" element={<EventPage />} />
//               {token && (
//                 <Route exact path="/bookings" element={<BookingPage />} />
//               )}
//             </Routes>
//           </main>
//         </AuthContext.Provider>
//       </>
//     </BrowserRouter>
//   );
// }
