import { createContext } from "react";

const AuthContext = createContext();
export default AuthContext;

// {
//   token: null,
//   userId: null,
//   login: (token, userId, tokenExpiration) => {},
//   logout: () => {},
// }
