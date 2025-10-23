import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import LandingPage from "../pages/LandingPage"; 
import ArticleFormPage from "../pages/ArticleFormPage";
import ArticleDetails from "../pages/ArticleDetailsPage";
import ArticleEdit from "../pages/ArticleEditPage";


export default function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/article/:id" element = {<ArticleDetails/>}/>
        <Route path="/article/edit/:id" element = {<ArticleEdit />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/article/new" element={<ArticleFormPage />} />
        <Route path="/article-form/:mode" element={<ArticleFormPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
       
       </Routes>
  );
}