import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LendingLayout from "./components/lending/Layout";
import Landing from "./pages/Landing";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./components/auth/Layout";
import Dashboard from "./pages/Dashboard";
import { ManageCourseComponent } from "./pages/ManageCourse";
import { StudentCourseViewComponent } from "./pages/StudentCourseViewComponent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LendingLayout><Landing /></LendingLayout>} />
        <Route path="/signup" element={<AuthLayout><SignupPage /></AuthLayout>} />
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/dashboard"element={<Dashboard />} />
        <Route path="/myCourse/:courseId" element={<ManageCourseComponent />} />
        <Route path="/course/:courseId" element={<StudentCourseViewComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
