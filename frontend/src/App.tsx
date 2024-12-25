import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LendingLayout from "./components/lending/Layout";
import Landing from "./pages/Landing";
import SignupPage from "./pages/SigupPage";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./components/auth/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LendingLayout><Landing /></LendingLayout>} />
        <Route path="/signup" element={<AuthLayout><SignupPage /></AuthLayout>} />
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
