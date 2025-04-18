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

    async function addComment(id, comment, setComment){
        try {
            const { data } = await axios.post("/api/pins/comment/" + id, { comment });
            toast.success(data.message);
            fetchPin(id);
            setComment("");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function deleteComment(id, commentId) {
        try {
            const { data } = await axios.delete(`/api/pins/comment/${id}?commentId=${commentId}`);
            toast.success(data.message);
            fetchPin(id);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function deletePin(id, navigate) {
        setLoading(true);
        try {
          const { data } = await axios.delete(`/api/pins/${id}`);
          toast.success(data.message);
          navigate("/");
          setLoading(false);
          fetchPins();
        } catch (error) {
          toast.error(error.response.data.message);
          setLoading(false);
        }
      }
    
    async function addPin(formData, setFilePrev, setFile, setTitle, setPin, navigate) {
        try {
            const { data } = await axios.post("/api/pins/new", formData)
            toast.success(data.message);
            setFilePrev("");
            setFile([]);
            setTitle("");
            setPin("");
            fetchPins();
            navigate("/");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchPins();
    }, []);

    return(
        <PinContext.Provider 
            value = {{
                pins, 
                loading, 
                fetchPin,
                fetchPins, 
                pin, 
                updatePin, 
                addComment, 
                deleteComment, 
                deletePin, 
                addPin
            }}>
            {children}
        </PinContext.Provider>
    )
}

export const PinData = () => useContext(PinContext);