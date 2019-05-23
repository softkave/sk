import React from "react";
import { Link } from "react-router-dom";
import "./web.css";

export default function Web() {
  return (
    <div className="web">
      <Link to="/signup">Signup</Link>
      <Link to="/login">Login</Link>
      <Link to="/forgot-password">Forgot Password</Link>
      <Link to="/change-password">Change Password</Link>
    </div>
  );
}
