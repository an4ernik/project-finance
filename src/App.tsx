import { Routes, Route } from "react-router-dom"
import Header from "./components/ui/Header"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"


function App() {
  
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
    </>
  )
}

export default App
