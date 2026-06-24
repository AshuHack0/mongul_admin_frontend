import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Pages
import AuthFlow from "../pages/auth/AuthFlow";
import Dashboard from "../pages/Dashboard";
import MentorApplications from "../pages/MentorApplications";
import MentorApplicationDetail from "../pages/MentorApplicationDetail";
import Mentors from "../pages/Mentors";
import Categories from "../pages/Categories";
import CategorySubcategories from "../pages/CategorySubcategories";
import CategoryChangeRequests from "../pages/CategoryChangeRequests";
import Surveys from "../pages/Surveys";
import Blog from "../pages/Blog";
import BlogList from "../pages/BlogList";
import BlogView from "../pages/BlogView";

const AppRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <Routes>
      {isAdmin ? (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mentor-applications" element={<MentorApplications />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route
            path="/mentor-applications/:applicationId"
            element={<MentorApplicationDetail />}
          />
          <Route path="/categories" element={<Categories />} />
          <Route
            path="/categories/:categoryId"
            element={<CategorySubcategories />}
          />
          <Route
            path="/category-change-requests"
            element={<CategoryChangeRequests />}
          />
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/list" element={<BlogList />} />
          <Route path="/blog/edit/:blogId" element={<Blog />} />
          <Route path="/blog/view/:blogId" element={<BlogView />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      ) : (
        <>
          <Route path="/auth/*" element={<AuthFlow />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
