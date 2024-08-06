// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListItems from "./components/ListItems";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  getUser,
  isAuthenticated,
  logout as authLogout,
} from "./helpers/authHelper";
import { Button } from "react-bootstrap";

const App: React.FC = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
    }
  }, []);

  const handleLogout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <Router>
      <div>
        <h1>CRUD Application</h1>
        {user && (
          <div>
            <h2>Welcome, {user.username}</h2>
            <Button onClick={handleLogout} variant="outline-danger">
              Logout
            </Button>
          </div>
        )}
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/" element={<ProtectedRoute element={ListItems} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
