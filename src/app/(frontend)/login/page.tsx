'use client';
import React from "react";
import { LoginLayout } from "@/components/page-components/login/LoginLayout";
import LoginForm from "@/components/page-components/login/LoginForm";

const LoginPage: React.FC = () => {
  const handleSubmit = (values: { email: string; password: string }) => {
    console.log("Login form submitted:", values);
    // Here you would typically handle the login logic, e.g., send to an API
  };

  return (
    <LoginLayout>
      <LoginForm onSubmit={handleSubmit} /> {/* Render LoginForm instead of PremiumLoginCard */}
    </LoginLayout>
  );
};

export default LoginPage;
