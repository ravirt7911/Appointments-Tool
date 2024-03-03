import React from "react";
import { useAuth } from "./AuthProvider"; // Create AuthProvider to handle Firebase authentication

const GoogleSignIn = () => {
  const { signInWithGoogle } = useAuth();

  return <button onClick={signInWithGoogle}>Sign In with Google</button>;
};

export default GoogleSignIn;
