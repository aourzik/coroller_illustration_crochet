import React from "react";

export default function PageContact({ dark }) {
    const txt = dark ? "#f0eef8" : "#0d0b1a";
    return (
        <div style={{ paddingTop: "140px", minHeight: "100vh", textAlign: "center", color: txt }}>
            <h1 style={{ fontFamily: "Georgia,serif" }}>Contact</h1>
            <p style={{ opacity: 0.6 }}>Une question ? Un projet ? Envoyez-moi un message.</p>
        </div>
    );
}