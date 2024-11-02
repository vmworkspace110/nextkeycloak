"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import { login, initKeycloak } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const kc = await initKeycloak();
        if (kc?.authenticated) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login();
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex min-vh-100 align-items-center justify-content-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="d-flex min-vh-100 align-items-center justify-content-center">
      <Card style={{ width: '400px' }}>
        <Card.Body className="text-center">
          <div className="mb-4">
            <i className="bi bi-key fs-1"></i>
          </div>
          <Card.Title className="h3 mb-3">License Management System</Card.Title>
          <Card.Text className="text-muted mb-4">
            Secure access to manage your licenses and users
          </Card.Text>
          <Button
            size="lg"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Signing In...
              </>
            ) : (
              "Sign In with Keycloak"
            )}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}