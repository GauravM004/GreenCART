import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { setUser } from "../features/auth/authSlice";
import toast from "react-hot-toast";
import { useGetCurrentUserQuery } from "../features/auth/authApi";

// This page handles the /oauth-success?token=... redirect from backend after Google OAuth
export default function OAuthSuccess() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data } = useGetCurrentUserQuery(undefined, { skip: !window.location.search.includes('token') });

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      
      if (token) {
        localStorage.setItem("token", token);
        
        try {
          if (data?.success && data.user) {
            dispatch(setUser(data.user));
            toast.success("Logged in successfully!");
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 100);
          } else {
            console.error("User data fetch failed:", data);
            toast.error(data?.message || "Failed to fetch user data");
            setTimeout(() => navigate("/", { replace: true }), 1000);
          }
        } catch (error) {
          console.error("OAuth success error:", error);
          toast.error("Authentication error");
          setTimeout(() => navigate("/", { replace: true }), 1000);
        }
      } else {
        toast.error("No token received from server");
        navigate("/", { replace: true });
      }
    };

    handleOAuthSuccess();
  }, [navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Logging you in...</p>
      </div>
    </div>
  );
}
