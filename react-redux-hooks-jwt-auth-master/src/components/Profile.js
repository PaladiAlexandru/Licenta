import React, { useState } from "react";
import { Redirect } from 'react-router-dom';
import axios from "axios";

const Profile = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));
 debugger
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
    } else {
      axios.put(`/api/users/${currentUser.id}/password`, { newPassword })
        .then(() => {
          setNewPassword("");
          setConfirmPassword("");
          setSuccessMessage("Password changed successfully");
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setRedirectToLogin(true);
  };

  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.name}</strong> Profile
        </h3>
      </header>
    
      <form onSubmit={handlePasswordChange}>
        <div className="form-group">
          <label htmlFor="new-password">New Password</label>
          <input
            type="password"
            className="form-control"
            id="new-password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="confirm-password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          Change Password
        </button>
       
      </form>
      
      <p>
        <strong>Role:</strong> {currentUser.rows[0].role == "secretar"? "Administrator":currentUser.rows[0].role}
      </p>
     
    </div>
  );
};

export default Profile;
