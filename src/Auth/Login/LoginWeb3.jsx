import React from "react";
import {
  ConnectEmbed,
  useShowConnectEmbed,
  lightTheme,
} from "@thirdweb-dev/react";
import { useNavigate } from "react-router-dom";

const customTheme = lightTheme({
  colors: {
    accentText: "#00e6a1",
    primaryText: "#261717",
    accentButtonBg: "#00e6a1",
    modalBg: "#fcfcfd",
    dropdownBg: "#fcfcfd",
  },
});

export default function LoginWeb3() {
  const showConnectEmbed = useShowConnectEmbed();
  const navigate = useNavigate();

  if (showConnectEmbed) {
    return (
      <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <img
          src="https://readymadeui.com/signin-image.webp"
          style={{
            width: "50%",
            height: "100vh",
            backgroundColor: "royalblue",
          }}
          alt="login-background"
        />
        <div
          style={{
            width: "50%",
            height: "100vh",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 className="titel-Login">Login</h1>
          <ConnectEmbed
            style={{ border: "none" }}
            showThirdwebBranding={false}
            theme={customTheme}
          />
        </div>
      </div>
    );
  } else {
    navigate("/");
    return null; // You might need to handle this scenario as per your application logic
  }
}
