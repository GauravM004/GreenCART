import React,{useState} from "react";
import { useAppDispatch } from "../app/hooks";
import { setUser, setShowUserLogin } from "../features/auth/authSlice";
import { setShowUserLogin as setUIShowUserLogin } from "../features/ui/uiSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useLoginUserMutation } from "../features/auth/authApi";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser] = useLoginUserMutation();

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      const result = await loginUser({ state, name, email, password });
      const data = result.data;
      if (data?.success) {
        navigate("/");
        dispatch(setUser(data.user));
        dispatch(setUIShowUserLogin(false));
      } else {
        toast.error(data?.message || "Unable to login right now");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={() => dispatch(setUIShowUserLogin(false))}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              placeholder="type here"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="w-full ">
          <p>Email</p>
          <input
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            placeholder="type here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="w-full ">
          <p>Password</p>
          <input
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            placeholder="type here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {state === "register" ? (
          <p>
            Already have account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
        <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
