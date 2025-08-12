import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import axiosInstance from "./useAxiosInstance";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";
 
const requestSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .required("Enter your email")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm,
      "Enter a valid email"
    ),
  phone: yup
    .string()
    .required("Enter your phone number")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .min(10, "Phone number must be at least 10 digits long")
    .max(10, "Phone number must be at most 10 digits long"),
});

const useSignUpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(requestSchema),
  });

  const onSubmit = async (data) => {
     setLoading(true);
    try {
      // First, submit owner request (only name, email, phone)
      const requestData = {
        name: data.name,
        email: data.email,
        phone: data.phone
      };
      
      const requestResponse = await axiosInstance.post(
        "/api/owner/auth/ownerRequest",
        requestData
      );
      
      if (requestResponse.data.success) {
        toast.success("Owner request submitted successfully! Please wait for admin approval before proceeding with registration.");
        // Don't navigate yet - user needs to wait for approval
      }
        
    } catch (error){
       if (error.response) {
        // Server responded with a status other than 200 range
        toast.error(
          `${error.response.data.message || "Owner request failed"}`
        );
      } else if (error.request) {
        // Request was made but no response was received
        toast.error("No response from server. Please try again later.");
      } else {
        // Something else caused the error
        toast.error(`Error: ${error.message}`);
      }
    }
     finally {
      setLoading(false);
    }
  };

  return { register, handleSubmit, errors, onSubmit, loading };
};

export default useSignUpForm;
