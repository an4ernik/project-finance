import { Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import VerifyEmailPage from "@/pages/VerifyEmailPage"
import ThemeProvider from "@/shared/providers/ThemeProvider"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"


function App() {
  return (
    <>
    <ThemeProvider>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </ThemeProvider>
    </>
  );
}

export default App;
