import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleButton() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google) return; // Google script not loaded yet or key missing

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          await loginWithGoogle(response.credential);
          navigate("/");
        } catch {
          // silently ignore; user can retry
        }
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      width: 320,
    });
  }, [loginWithGoogle, navigate]);

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return null;

  return (
    <div>
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">OR CONTINUE WITH</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div ref={buttonRef} className="flex justify-center" />
    </div>
  );
}
