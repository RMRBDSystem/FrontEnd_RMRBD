import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from '../../Layout';
import LayoutModerator from '../../LayoutModerator';
import { AuthProvider } from "./AuthContext";
//Page
import Login from "../LoginPage/LoginPage";
import HomePage from "../HomePage/HomePage";
import FAQPage from "../Pages/FAQ";
import WithDrawMod from "../Pages/Withdraw/WithdrawMod";
import WithdrawResponse from "../Pages/Withdraw/WithdrawResponse";
import WithDrawRequest from "../Pages/Withdraw/WithdrawRequest";
import WithdrawList from "../Pages/Withdraw/WithdrawList";
import Product from "../HomePage/Products";
//Customer
import AddRecipePageForCustomer from "../AddRecipe/RecipeCustomer";
import Book from '../Pages/Book/Book';
import BookDetail from '../Pages/Book/BookDetail';
import Ebook from '../Pages/Ebook/Ebook';
import EbookDetail from '../Pages/Ebook/EbookDetail';
import EbookReader from '../Pages/Ebook/EbookReader';
import Cart from '../Cart/ShoppingCart';
import Checkout from "../Cart/Checkout";
import Orders from "../Cart/Orders/Orders";
import OrderFullDetails from '../Cart/Orders/OrderFullDetails';
import DetailsBookCustomer from '../CustomerBook/DetailBookCustomer';
import ListEbookCustomer from '../CustomerEbook/ListEbookCustomer';
import AddBookCustomer from '../CustomerBook/AddBookCustomer';
import AddEBookCustomer from '../CustomerEbook/AddEbookCustomer';
import DetailSavedRecipe from '../Pages/Recipe/DetailSavedRecipe';
import EditRoleUpdate from '../AccountProfile/EditRoleUpdate';
import Address from "../AddressPage/Address";
//import Addbook from '../Pages/Add Items/AddBook';
import Recipe from "../Pages/Recipe/Recipe";
import RecipeDetail from "../Pages/Recipe/RecipeDetail";
import UpdateProfile from '../AccountProfile/AccountProfile';
import UpdateAccount from '../AccountProfile/UpdateAccount';
import ViewRoleUpdateSubmit from '../AccountProfile/ViewRoleUpdateSubmit';
import EditRecipeForCustomer from "../Pages/Recipe/EditSavedRecipe";
import SellerOrders from "../Cart/Orders/SellerOrders";
//Recharge
import RechargePage from '../Pages/Recharge/Recharge';
import CoinTransaction from "../Pages/Recharge/CoinTransaction";
import TermsOfPurchase from '../Pages/Recharge/TermsOfPurchase';
import PaymentSuccess from '../Pages/Recharge/PaymentSuccess'
import PaymentFailed from '../Pages/Recharge/PaymentFailed'
//Seller
import EditRecipe from '../AddRecipe/EditRecipe';
import RecipeCustomer from "../AddRecipe/RecipeCustomer";
import RecipeCustomerDetail from "../AddRecipe/RecipeCustomerDetail";
import RecipeListCustomer from "../AddRecipe/RecipeListCustomer";
import BookListCustomer from '../CustomerBook/ListBookCustomer'
//Moderator
import Report from "../Pages/Report/Report";
import ListReport from "../Pages/Report/ListReport";
import ReportDetail from "../Pages/Report/ReportDetail";
import ReportMod from "../Pages/Report/ReportMod";
import ReportResponse from "../Pages/Report/ReportResponse";
import UpdateEbook from "../Moderator/UpdateEBook";
import UpdateBook from "../Moderator/UpdateBook";
import UpdateRecipeDetails from "../Moderator/Details/UpdateRecipeDetails";
import UpdateRoleDetails from "../Moderator/Details/UpdateRoleDetails";
import UpdateRecipe from "../Moderator/UpdateRecipe";
import UpdateInformation from "../Moderator/UpdateInformation";
import UpdateBookDetails from "../Moderator/Details/UpdateBookDetails";
import UpdateAccountDetails from "../Moderator/Details/UpdateAccountDetails";
import UpdateAccountMod from "../Moderator/UpdateAccount";
//Admin
// import RecipeDetails from "../Admin/Recipemanagement/RecipeDetail";
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
import Unauthorized from '../Pages/Unauthorized'
export default function RouterPage() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
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
          <Route path="/admin/feedback" element={<Feedback />} />
          <Route path="/pdf-protect" element={<PDFProtect />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Customer"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />


          <Route
            path="/edit-recipe/:id"
            element={
              <ProtectedRoute allowedRoles={["Seller", "Customer"]}>
                <EditRecipe />
              </ProtectedRoute>
            }
          />
          <Route element={<Layout />}>

            <Route path="/edit-profile/:accountID" element={<EditRoleUpdate />} />
            <Route path="/recipecustomer-detail/:recipeId" element={<DetailSavedRecipe />} />
            <Route path="/add-ebook-customer" element={<AddEBookCustomer />} />
            <Route path="/add-book-customer" element={<AddBookCustomer />} />
            <Route path="/list-ebook-customer" element={<ListEbookCustomer />} />
            <Route path="/book-list-customer/:bookId" element={<DetailsBookCustomer />} />
            <Route path="/recipe-customer-detail/:recipeId" element={<RecipeCustomerDetail />} />
            <Route path="/update-account" element={<UpdateProfile />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/recipe/:searchString?" element={<Recipe />} />
            <Route path="/recipe-detail/:recipeId" element={<RecipeDetail />} />
            <Route path="/book/:searchString?" element={<Book />} />
            <Route path="/book-detail/:bookId" element={<BookDetail />} />
            <Route path="/ebook" element={<Ebook />} />
            <Route path="/ebook/:ebookId" element={<EbookDetail />} />
            <Route path="/ebook/:ebookId/read" element={<EbookReader />} />
            <Route path="/coinTransaction" element={<CoinTransaction />} />
            <Route path="/termsofpurchase" element={<TermsOfPurchase />} />
            <Route path="/edit-recipe" element={<EditRecipe />} />
            <Route path="/recipe-customer" element={<RecipeCustomer />} />
            <Route path="/recipe-customer-detail" element={<RecipeCustomerDetail />} />
            <Route path="/recipe-list-customer" element={<RecipeListCustomer />} />
            <Route path="/editrecipecustomer-recipe/:recipeId" element={<EditRecipeForCustomer />} />
            <Route path="/listreport" element={<ListReport />} />
            <Route path="/reportdetail/:reportId" element={<ReportDetail />} />
            <Route path="/reportmod" element={<ReportMod />} />
            <Route path="/reportresponse/:reportId" element={<ReportResponse />} />
            <Route path="/report" element={<Report />} />
            <Route path="/withdrawrequest" element={<WithDrawRequest />} />
            <Route path="/withdrawlist" element={<WithdrawList />} />
            <Route path="/withdrawmod" element={<WithDrawMod />} />
            <Route path="/withdrawresponse/:coinTransactionId" element={<WithdrawResponse />} />
            <Route path="/update-information" element={<UpdateAccount />} />
            <Route path="/form-updated-role" element={<ViewRoleUpdateSubmit />} />
            <Route path="/product/:searchString?" element={<Product />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route
              path="/recipecustomer-list"
              element={
                <ProtectedRoute allowedRoles={["Seller", "Customer"]}>
                  <RecipeListCustomer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/list-saved-recipe"
              element={
                <ProtectedRoute allowedRoles={["Seller", "Customer"]}>
                  <GetListSaveRecipe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recharge"
              element={
                <ProtectedRoute allowedRoles={["Customer", "Seller"]}>
                  <RechargePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={["Seller", "Customer"]}>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={["Seller", "Customer"]}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={["Seller", "Customer"]}>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller-orders"
              element={
                <ProtectedRoute allowedRoles={["Seller", "Customer"]}>
                  <SellerOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:orderId"
              element={
                <ProtectedRoute allowedRoles={["Seller", "Customer"]}>
                  <OrderFullDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-recipe"
              element={
                <ProtectedRoute allowedRoles={["Admin", "Moderator", "Customer"]}>
                  <AddRecipePageForCustomer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipe-customer-list"
              element={
                <ProtectedRoute allowedRoles={["Seller", "Customer"]}>
                  <RecipeListCustomer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-list-customer"
              element={
                <ProtectedRoute allowedRoles={["Seller", "Customer"]}>
                  <BookListCustomer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/address"
              element={
                <ProtectedRoute allowedRoles={["Seller", "Customer"]}>
                  <Address />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route element={<LayoutModerator />}>
            {[
              { path: "/update-ebook", component: <UpdateEbook /> },
              { path: "/update-book", component: <UpdateBook /> },
              { path: "/update-role", component: <UpdateRole /> },
              { path: "/update-recipe", component: <UpdateRecipe /> },
              { path: "/update-account-mod", component: <UpdateAccountMod /> },
              {
                path: "/update-moderator-information",
                component: <UpdateInformation />,
              },
              {
                path: "/update-recipe/:recipeId",
                component: <UpdateRecipeDetails />,
              },
              {
                path: "/update-role/:accountId",
                component: <UpdateRoleDetails />,
              },
              {
                path: "/update-book/:bookId",
                component: <UpdateBookDetails />,
              },
              {
                path: "/update-account-mod/:accountId",
                component: <UpdateAccountDetails />,
              },
            ].map(({ path, component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute allowedRoles={["Moderator"]}>
                    {component}
                  </ProtectedRoute>
                }
              />
            ))}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}
