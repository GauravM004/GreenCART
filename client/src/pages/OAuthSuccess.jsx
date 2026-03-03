import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

// This page handles the /oauth-success?token=... redirect from backend after Google OAuth
export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { setUser, axios } = useAppContext();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Optionally, fetch user info to update context
      axios.get("/api/user/is-auth").then(({ data }) => {
        if (data.success) {
          setUser(data.user);
        //   toast.success("Logged in with Google!");
          navigate("/");
        } else {
          toast.error("Auth failed");
          navigate("/login");
        }
      });
    } else {
      toast.error("No token found");
      navigate("/login");
    }
  }, []);

  return <div>Logging you in...</div>;
}
