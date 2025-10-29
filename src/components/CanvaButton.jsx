// function CanvaButton() {
//   const clientId = "OC-AZj0khmj1FF2";
//   const redirectUri = "http://127.0.0.1:3001/oauth/redirect";
//   const scopes = "design:content asset profile brandtemplate:content brandtemplate:meta";

//   const authUrl = `https://www.canva.com/api/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
//     redirectUri
//   )}&scope=${encodeURIComponent(scopes)}`;

//   return (
//     <a href={authUrl}>
//       <button>🎨 Connect with Canva</button>
//     </a>
//   );
// }


import React from "react";

// ================= PKCE Helpers =================
function generateRandomString(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ("0" + dec.toString(16)).slice(-2)).join(
    ""
  );
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const CanvaButton = () => {
  const clientId = "OC-AZj0khmj1FF2"; // replace with your real Client ID
  const redirectUri = "http://127.0.0.1:5173/oauth/callback"; // frontend route
  const backendRedirect = "http://127.0.0.1:3001/oauth/redirect"; // backend route
  const scopes =
    "design:content asset profile brandtemplate:content brandtemplate:meta";

  const handleClick = async () => {
    const codeVerifier = generateRandomString(64);
    console.log("code verif", codeVerifier);
    localStorage.setItem("canva_code_verifier", codeVerifier);
    localStorage.setItem("canva_backend_redirect", backendRedirect);

    const codeChallenge = await generateCodeChallenge(codeVerifier);
    console.log("code Challange", codeChallenge);

    const authUrl = `https://www.canva.com/api/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(
      scopes
    )}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    console.log("Auth Url", authUrl);

    // window.location.href = authUrl;
  };

  return (
    <div className="w-screen h-screen bg-gray-400 ">
      <button className="bg-white p-4 m-4" onClick={handleClick}>
        🎨 Connect with Canva
      </button>
    </div>
  );
};

export default CanvaButton;
