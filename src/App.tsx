import { Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import Header from "./components/ui/Header"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import VerifyEmailPage from "@/pages/VerifyEmailPage"
import ThemeProvider from "@/shared/providers/ThemeProvider"


function App() {

  return (
    <>
    <ThemeProvider>
      <Toaster />
      <Header />
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<VerifyEmailPage />}/>
      </Routes>
    </ThemeProvider>
    </>
  )
}

export default App
