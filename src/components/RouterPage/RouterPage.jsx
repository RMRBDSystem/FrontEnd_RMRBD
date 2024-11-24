import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from '../../Layout';
import { AuthProvider } from "./AuthContext";
//Page
import Login from "../LoginPage/LoginPage";
import HomePage from "../HomePage/HomePage";
import Landing from "../LandingPage/Landing";
import FAQPage from "../Pages/FAQ";
//Customer
import AddRecipePageForCustomer from "../AddRecipe/RecipeCustomer";
import AddEbookPageForCustomer from "../AddItems/EbookCustomer";
import Book from '../Pages/Book/Book';
import BookDetail from '../Pages/Book/BookDetail';
import Recipe from "../Pages/Recipe/Recipe";
import RecipeDetail from "../Pages/Recipe/RecipeDetail";
import UpdateProfile from '../AccountProfile/AccountProfile';
import EditRecipeForCustomer from "../Pages/Recipe/EditSavedRecipe";
//Recharge
import RechargePage from '../Pages/Recharge/Recharge';
import CoinTransaction from "../Pages/Recharge/CoinTransaction";
import TermsOfPurchase from '../Pages/Recharge/TermsOfPurchase';
import PaymentSuccess from '../Pages/Recharge/PaymentSuccess'
import PaymentFailed from '../Pages/Recharge/PaymentFailed'
import Cart from '../Cart/ShoppingCart';
//Seller
import EditRecipe from '../AddRecipe/EditRecipe';
import RecipeCustomer from "../AddRecipe/RecipeCustomer";
import RecipeCustomerDetail from "../AddRecipe/RecipeCustomerDetail";
import RecipeListCustomer from "../AddRecipe/RecipeListCustomer";
//Admin
import RecipeDetails from "../Admin/Recipemanagement/RecipeDetail";
import AdminDashboard from "../Admin/Dashboard";
import AccountManagement from '../Admin/AccountManagement';
import IncomeManagement from '../Admin/IncomeManagement';
import Reports from '../Admin/Reports';
import CategoryManagement from '../Admin/CategoryManagement';
import RecipeManagement from '../Admin/Recipe';
import EBookTest from '../Admin/TestEbook';
import Feedback from '../Admin/Feedback';
import GetListSaveRecipe from "../Pages/Recipe/GetListSavedRecipe";

//API TEST
import AdminRecipe from "../Admin/Recipemanagement/ShowRecipe";
import AdminCreateRecipe from "../Admin/Recipemanagement/CreateRecipe";
import UpdateRole from "../Moderator/UpdateRole";
import PDFProtect from '../API Test/PDFProtect';
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
          <Route path="/adminrecipe" element={<AdminRecipe />} />
          <Route path="/admincreaterecipe" element={<AdminCreateRecipe />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/admin/ebooktest" element={<EBookTest />} />
          <Route path="/admin//feedback" element={<Feedback />} />
          <Route path="/pdf-protect" element={<PDFProtect />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Customer"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route element={<Layout />}>
            <Route path="/recipe-detail/:recipeId" element={<RecipeDetails />} />
            <Route path="/recipe-customer-detail/:recipeId" element={<RecipeCustomerDetail />} />
            <Route path="/update-account" element={<UpdateProfile />} />
            <Route path="/update-role" element={<UpdateRole />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/recipe" element={<Recipe />} />
            <Route path="/recipe/:recipeId" element={<RecipeDetail />} />
            <Route path="/book" element={<Book />} />
            <Route path="/book/:bookId" element={<BookDetail />} />
            <Route path="/recharge" element={<RechargePage />} />
            <Route path="/coinTransaction" element={<CoinTransaction />} />
            <Route path="/termsofpurchase" element={<TermsOfPurchase />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/edit-recipe" element={<EditRecipe />} />
            <Route path="/recipe-customer" element={<RecipeCustomer />} />
            <Route path="/recipe-customer-detail" element={<RecipeCustomerDetail />} />
            <Route path="/recipe-list-customer" element={<RecipeListCustomer />} />
            <Route path="/list-saved-recipe" element={<GetListSaveRecipe />} />
            <Route path="/editrecipecustomer-recipe/:recipeId" element={<EditRecipeForCustomer />} />
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
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}
