import { createContext, use, useContext, useEffect, useState} from "react";
import toast, {Toaster} from "react-hot-toast";
import axios from "axios";  
import { PinData } from "./PinContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [isAuth, setIsAuth] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);

    async function registerUser(name, email, password, navigate, fetchPins) {
        setBtnLoading(true);
        try {
            const {data} = await axios.post("/api/user/register",{name, email, password});

            toast.success(data.message);
            setUser(data.user);
            setIsAuth(true);
            setBtnLoading(false);
            navigate("/");
            fetchPins();
        }catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false);
        }
    }
    async function loginUser(email, password, navigate, fetchPins) {
        setBtnLoading(true);
        try {
            const {data} = await axios.post("/api/user/login",{email, password});

            toast.success(data.message);
            setUser(data.user);
            setIsAuth(true);
            setBtnLoading(false);
            navigate("/");
            fetchPins();
        }catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false);
        }
    }

    const [loading, setLoading] = useState(true);
    async function fetchUser() {
        try {
          const response = await axios.get("/api/user/me");
          if (response.data) {
            setUser(response.data);
            setIsAuth(true);
          } else {
            setIsAuth(false);
          }
          setLoading(false);
        } catch (error) {
          console.error(error);
          setIsAuth(false);
          setLoading(false);
        }
      }

      useEffect(() => {
        fetchUser();
      }, []);

    return (
        <UserContext.Provider 
          value={{
            loginUser, 
            btnLoading, 
            isAuth, 
            setIsAuth,
            user, 
            setUser,
            loading, 
            registerUser
          }}>
            {children}
        </UserContext.Provider>
    );
};

export const UserData = () => (useContext(UserContext));