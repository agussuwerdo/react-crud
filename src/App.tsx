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
import { Button, Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import Register from "./components/Register";
import packageJson from '../package.json';

const App: React.FC = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "logout App?",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        authLogout();
        setUser(null);
      }
    });
  };

  return (
    <Container>
      <Router>
        <div>
          <Row>
            <Col>
              <h1>CRUD Application ver:{packageJson.version}</h1>
            </Col>
            <Col className="pull-right">
              {user && (
                <Row>
                  <h2 className="text-end">Welcome, {user.username}</h2>
                  <div className="text-end">
                    <Button onClick={handleLogout} variant="outline-danger">
                      Logout
                    </Button>
                  </div>
                </Row>
              )}
            </Col>
          </Row>
          <Routes>
            <Route path="/login" element={<Login onLogin={setUser} />} />
            <Route path="/register" element={<Register onRegister={()=>{}} />} />
            <Route path="/" element={<ProtectedRoute element={ListItems} />} />
          </Routes>
        </div>
      </Router>
    </Container>
  );
};

export default App;
