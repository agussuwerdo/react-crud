// src/components/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase-config";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { login as authLogin, getUser } from "../helpers/authHelper";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { login as apiLogin } from "../services/api";

interface LoginProps {
  onLogin: (user: { username: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result: UserCredential = await signInWithPopup(
        auth,
        googleProvider
      );
      const user = result.user;
      await user.getIdToken(); // Get Firebase ID token
      const token = await apiLogin(user.displayName || email, password);
      authLogin(token);
      const userBE = getUser();
      if (userBE) {
        onLogin(userBE);
      }
      navigate("/");
    } catch (error) {
      setError("Error logging in with Google: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state

    // Validation for empty fields
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true); // Start loading
    try {
      // Sign in with email and password
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await user.getIdToken(); // Get Firebase ID token
      const token = await apiLogin(user.displayName || email, password);
      authLogin(token);
      const userBE = getUser();
      if (userBE) {
        onLogin(userBE);
      }
      navigate("/");
    } catch (error) {
      setError("Error logging in: " + (error as Error).message);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Loading...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </Form>

      <Button
        variant="outline-primary"
        className="mt-3"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" /> Loading...
          </>
        ) : (
          "Login with Google"
        )}
      </Button>

      <div className="mt-3">
        <Button variant="outline-info" onClick={() => navigate("/register")}>
          Need an account? Register
        </Button>
      </div>
    </Container>
  );
};

export default Login;
