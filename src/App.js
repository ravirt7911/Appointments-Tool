import React, { useEffect, useState } from "react";
import { useAuth } from "./firebaseconfig";
import MainScreen from "./components/MainScreen";
import "./App.css";

const App = () => {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (user === null) {
      setIsSigningIn(false);
    } else {
      setIsSigningIn(false);
    }
  }, [user]);

  const handleSignInClick = () => {
    if (user === null) {
      setIsSigningIn(true);
      signInWithGoogle();
    } else {
      signOutUser();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="user-info">
          {user ? (
            <>
              <button onClick={handleSignInClick}>Sign Out</button>
            </>
          ) : (
            <button onClick={handleSignInClick}>
              {isSigningIn ? "Signing In..." : "Sign In with Google"}
            </button>
          )}
        </div>
      </header>
      {user && <MainScreen />}
    </div>
  );
};

export default App;
