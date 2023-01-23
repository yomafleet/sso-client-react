import "./App.css";
import { SSOClient, SSOProvider, useAuth } from "./sso";
import { User } from "./sso/user";

// REACT_APP_COGNITO_USER_ID="ap-southeast-1_7g0492XkI"
// REACT_APP_COGNITO_CLIENT_ID="57fvb75dd1p93ri66fut2obff4"
// REACT_APP_OAUTH_DOMAIN = "apk.auth.ap-southeast-1.amazoncognito.com"

const client = new SSOClient({
  // domain: "apk.auth.ap-southeast-1.amazoncognito.com",
  // client_id: "57fvb75dd1p93ri66fut2obff4",
  domain: "auth.yomafleet.com",
  client_id: "35lnmi0ra8dda19eu2o7r74fau",
  redirect_uri: window.location.origin,
});

function App() {
  const onRedirectCalback = (user: User) => {
    window.location.replace(window.location.pathname);
    console.log(user);
  };

  return (
    <SSOProvider client={client} onRedirectCalback={onRedirectCalback}>
      <Login />
    </SSOProvider>
  );
}

const Login = () => {
  const { loginWithRedirect, logout, error, user } = useAuth();
  return (
    <div>
      {error?.message}
      {user?.name}
      <button onClick={loginWithRedirect}>Login With Yoma Fleet</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default App;
