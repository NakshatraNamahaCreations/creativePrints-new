import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function OAuthHandler() {
  const location = useLocation();

  useEffect(() => {
    const runOAuth = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const error = params.get("error");
      const verifier = localStorage.getItem("canva_code_verifier");
      const backendRedirect = localStorage.getItem("canva_backend_redirect");

      if (error) {
        console.error("❌ Canva OAuth error:", params.get("error_description"));
        alert("❌ Canva OAuth failed. Check console for details.");
        return;
      }

      if (code && verifier) {
        try {
          const res = await fetch(
            `${backendRedirect}?code=${encodeURIComponent(
              code
            )}&verifier=${encodeURIComponent(verifier)}`
          );
          const data = await res.text();
          console.log("Backend response:", data);
          alert("✅ Canva connected! Check backend logs for access token.");

          // cleanup
          localStorage.removeItem("canva_code_verifier");
        } catch (err) {
          console.error("OAuth error:", err);
          alert("❌ OAuth request failed.");
        }
      }
    };

    runOAuth();
  }, [location]);

  return <p>🔄 Connecting to Canva...</p>;
}

export default OAuthHandler;
