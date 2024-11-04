import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../LoginPage/LoginPage";
import HomePage from "../HomePage/HomePage";
import ProtectedRoute from "./ProtectedRoute.jsx";
// Điều hướng tới đâu thì uncomment thay link đi rồi dùng
export default function RouterPage() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
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
              {/* <ModeratorDashboard /> */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
