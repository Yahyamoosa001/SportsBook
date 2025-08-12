import { Link } from "react-router-dom";
import useCompleteRegistration from "@hooks/useCompleteRegistration";
import { Button, FormField } from "@components/common";

const CompleteRegistration = () => {
  const { register, handleSubmit, errors, onSubmit, loading } = useCompleteRegistration();
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl border">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-6">Complete Registration</h2>
          <p className="text-sm text-gray-600 mb-4">
            Your owner request has been approved! Please set your password to complete registration.
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="Enter the email you used for your request"
            />
            
            <FormField
              label="Password"
              name="password"
              type="password"
              register={register}
              error={errors.password}
              placeholder="Create a strong password"
            />
            
            <FormField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              register={register}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
            />

            <div className="form-control mt-6">
              <Button
                type="submit"
                className="btn-primary w-full"
                loading={loading}
              >
                Complete Registration
              </Button>
            </div>
          </form>
          
          <div className="text-center mt-6">
            <Link to="/login" className="link link-hover">
              Already completed registration? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteRegistration;
