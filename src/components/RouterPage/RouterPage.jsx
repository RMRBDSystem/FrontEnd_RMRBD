import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../LoginPage/LoginPage";
import HomePage from "../HomePage/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import LandingPage from "../LandingPage/Landing";
import AddRecipePage from "../Admin/Recipe";
import AddRecipePageForCustomer from "../AddRecipe/RecipeCustomer";
import FAQPage from "../Pages/FAQ";
import MealsPage from "../Pages/Meals";
import AdminDashboard from "../Admin/Dashboard";
import { AuthProvider } from "./AuthContext";
import AccountManagement from '../Admin/AccountManagement';
import IncomeManagement from '../Admin/IncomeManagement';
import Reports from '../Admin/Reports';
import CategoryManagement from '../Admin/CategoryManagement';
import RecipeManagement from '../Admin/Recipe';

export default function RouterPage() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin/account-management" element={<AccountManagement />} />
          <Route path="/admin/income-management" element={<IncomeManagement />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/category-management" element={<CategoryManagement />} />
          <Route path="/admin/recipemanagement" element={<RecipeManagement />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/homepageDashboard" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route
            path="/add-recipe"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Moderator","Customer"]}>
                <AddRecipePageForCustomer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
