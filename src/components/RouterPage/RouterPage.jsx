import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../LoginPage/LoginPage";
// import CRUD from "./CRUD";
// import AdminDashboard from "./AdminDashboard";
// import HomePage from "./HomePageDashboard";
// import ProtectedRoute from "./ProtectedRoute";
// import ModeratorDashboard from "./MorderatorDashboard";

// Điều hướng tới đâu thì uncomment thay link đi rồi dùng
export default function RouterPage() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/adminDashboard" element={<CRUD />} />

        <Route
          path="/homepageDashboard"
          element={
            <ProtectedRoute allowedRoles={["Customer"]}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/moderatorDashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Moderator"]}>
              <ModeratorDashboard />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
}
