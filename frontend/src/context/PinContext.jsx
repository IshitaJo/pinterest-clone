import { createContext, useState ,useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
// import { set } from "mongoose";

const PinContext = createContext();

export const PinProvider = ({ children }) => {
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchPins() {
        try {
            const { data } = await axios.get("/api/pins/all");
            setPins(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    async function updatePin(id, title, pin, setEdit) {
        try {
            const { data } = await axios.put("/api/pins/" + id, { title, pin });
            toast.success(data.message);
            fetchPin(id);
            setEdit(false);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    const [pin, setPin] = useState([]);
    async function fetchPin(id){
        setLoading(true);
        try {
            const { data } = await axios.get("/api/pins/"+id);
            setPin(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false); 
        }
    }

    useEffect(() => {
        fetchPins();
    }, []);

    return(
        <PinContext.Provider value = {{pins, loading, fetchPin, pin, updatePin}}>
            {children}
        </PinContext.Provider>
    )
}

export const PinData = () => useContext(PinContext);