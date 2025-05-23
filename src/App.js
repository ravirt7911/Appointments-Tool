import React, { useEffect, useState } from "react";
import { useAuth } from "./firebaseconfig";
import MainScreen from "./components/MainScreen";
import "./App.css";

const App = () => {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
        <div style={{ marginRight: "24px", fontWeight: "bold" }}>
          {now.toLocaleString()}
        </div>
        <div className="user-info">
          {user ? (
            <>
              {/* Show profile picture and name */}
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="user-profile"
                />
              )}
              {user.displayName && (
                <span style={{ marginRight: "12px" }}>{user.displayName}</span>
              )}
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
