import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { loginSchema } from "../../schemas/auth";
import { Mail, Lock } from "lucide-react";

export const LoginPage=()=> {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => signin(data);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1221]">
      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-4" style={{ marginTop: '15vh' }}>
        {/* Login Container */}
        <div className="w-full max-w-[400px]">
          {/* Card */}
          <div className="relative bg-[#151F32]/80 rounded-xl backdrop-blur-sm border border-gray-700/50 shadow-xl">
            {/* Header */}
            <div className="pt-8 pb-4 text-center">
              <h1 className="text-2xl font-bold text-white mb-1">Bienvenido</h1>
              <p className="text-sm text-gray-400">Sign in to continue</p>
            </div>

            {/* Form Container */}
            <div className="p-6">
              {/* Error Messages */}
              {loginErrors.map((error, i) => (
                <div key={i} className="mb-4 p-2 bg-red-900/30 border border-red-700/50 text-red-200 rounded-lg text-sm">
                  {error}
                </div>
              ))}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300 block">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full h-10 pl-9 pr-3 bg-[#1A2537] border border-gray-700/50 text-gray-200 rounded-lg 
                               focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300 block">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      {...register("password")}
                      className="w-full h-10 pl-9 pr-3 bg-[#1A2537] border border-gray-700/50 text-gray-200 rounded-lg 
                               focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium
                           transition-colors duration-200"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div className="text-center text-gray-400 pb-8">
        <p>En MS De Valor encuentras todo en un</p>
      </div>
    </div>
  );
}