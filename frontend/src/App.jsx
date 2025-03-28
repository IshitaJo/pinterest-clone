import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserData } from "./context/UserContext";
import { Loading } from "./components/Loading";
import Navbar from "./components/Navbar";


const App = () => {
  const { loading, isAuth, user } = UserData();
  return (
    <>  
      {loading ? (<Loading />) : (
        <BrowserRouter>
        {isAuth && <Navbar />}
        <Routes>
          <Route path="/" element={isAuth ? <Home /> : <Home />} />
          <Route path="/login" element={isAuth ? <Home /> : <Login />} />
          <Route path="/register" element={isAuth ? <Home /> : <Register />} />
        </Routes>
      </BrowserRouter>
      )}
    </>
  )
}

export default App;