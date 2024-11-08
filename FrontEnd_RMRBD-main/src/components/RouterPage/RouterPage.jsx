import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../LoginPage/LoginPage";
import HomePage from "../HomePage/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import Landing from "../LandingPage/Landing";
import Layout from '../../Layout';
import AddRecipePageForCustomer from "../AddRecipe/RecipeCustomer";
import AddEbookPageForCustomer from "../AddItems/EbookCustomer";
import FAQPage from "../Pages/FAQ";
import Book from '../Pages/Book/Book';
import BookDetail from '../Pages/Book/BookDetail';
import MealsPage from "../Pages/Meals";
import AdminDashboard from "../Admin/Dashboard";
import { AuthProvider } from "./AuthContext";
import AccountManagement from '../Admin/AccountManagement';
import IncomeManagement from '../Admin/IncomeManagement';
import Reports from '../Admin/Reports';
import CategoryManagement from '../Admin/CategoryManagement';
import RecipeManagement from '../Admin/Recipe';
import EBookTest from '../Admin/TestEbook';
import Feedback from '../Admin/Feedback';
import Dashboard from '../Admin/Dashboard';


export default function RouterPage() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} /> {/* Trang Landing không có Navbar và Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/account-management" element={<AccountManagement />} />
          <Route path="/admin/income-management" element={<IncomeManagement />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/category-management" element={<CategoryManagement />} />
          <Route path="/admin/recipemanagement" element={<RecipeManagement />} />
          <Route path="/admin/ebooktest" element={<EBookTest/>} />
          <Route path="/admin//feedback" element={<Feedback />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route
              path="/add-recipe"
              element={
                <ProtectedRoute allowedRoles={["Admin", "Moderator", "Customer"]}>
                  <AddRecipePageForCustomer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-ebook"
              element={
                <ProtectedRoute allowedRoles={["Admin", "Moderator", "Customer"]}>
                  <AddEbookPageForCustomer />
                </ProtectedRoute>
              }
            />
          <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["Admin", "Customer"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/book" element={<Book />} />
            <Route path="/book/:bookId" element={<BookDetail />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}
