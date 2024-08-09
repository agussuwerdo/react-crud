// src/components/Register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { register as apiRegister } from "../services/api";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";

interface RegisterProps {
  onRegister: (user: { username: string }) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // New success state
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state
    setSuccess(null); // Reset success state

    // Validation for empty fields
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true); // Start loading
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await apiRegister(email, password); // Register user with your API
      setSuccess("Account successfully created!"); // Set success message
      onRegister({ username: email });
      setTimeout(() => navigate("/"), 2000); // Navigate after 2 seconds to show the success message
    } catch (error) {
      setError("Error registering: " + (error as Error).message);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>} {/* Success alert */}
      <Form onSubmit={handleRegister}>
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
            "Register"
          )}
        </Button>
      </Form>

      <Button
        variant="outline-info"
        className="mt-3"
        onClick={() => navigate('/login')}
      >
        Back to Login
      </Button>
    </Container>
  );
};

export default Register;
