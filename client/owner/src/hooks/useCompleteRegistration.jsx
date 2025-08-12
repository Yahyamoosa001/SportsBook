import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import axiosInstance from "./useAxiosInstance";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";

const completeRegistrationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Enter your email")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm,
      "Enter a valid email"
    ),
  password: yup
    .string()
    .required("Enter your password")
    .min(6, "Password must be at least 6 characters long"),
  confirmPassword: yup
    .string()
    .required("Enter your password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const useCompleteRegistration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(completeRegistrationSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Complete owner registration with password
      // The backend will fetch name and phone from the approved request using email
      const response = await axiosInstance.post("/api/owner/auth/register", {
        email: data.email,
        password: data.password,
      });
      
      const result = await response.data;
      toast.success(result.message);
      dispatch(login({ token: result.token, role: result.role }));
      
      if (result.role === "owner") {
        navigate("/owner");
      } else if (result.role === "admin") {
        navigate("/admin");
      }
      
    } catch (error) {
      if (error.response) {
        toast.error(error.response?.data?.message || "Registration failed");
      } else if (error.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return { register, handleSubmit, errors, onSubmit, loading };
};

export default useCompleteRegistration;
