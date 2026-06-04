"use client";

export default function Navbar(): React.JSX.Element {
  const T = {
    red: "#e43e38",
  };

  return (
    <div
      style={{
        background: T.red,
        height: 58,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* LEFT - BRAND */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.3px",
          }}
        >
          Resource Engagement Portal
        </span>
      </div>

      {/* RIGHT - USER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
        }}
      >
        {/* AVATAR */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: "0.5px",
          }}
        >
          SM
        </div>

        {/* USER NAME */}
        <div
          style={{
            textAlign: "right",
            lineHeight: 1.2,
          }}
        >
          <p
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: 800,
              margin: 0,
            }}
          >
            Shubham Mohite
          </p>
        </div>

        {/* LOGOUT */}
        <button
          type="button"
          style={{
            background: "transparent",
            border: "1.5px solid rgba(255,255,255,0.8)",
            color: "#fff",
            borderRadius: 24,
            padding: "7px 16px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            transition: "0.2s",
          }}
          onClick={() => {
            console.log("Logout clicked");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
