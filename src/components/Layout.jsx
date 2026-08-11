import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../styles/Layout.css";

export default function Layout({ children }) {
  const [sidebarExpandido, setSidebarExpandido] = useState(true);

  return (
    <div className={`app-wrapper ${sidebarExpandido ? "expanded" : "collapsed"}`}>
      <Sidebar
        sidebarExpandido={sidebarExpandido}
        onToggle={() => setSidebarExpandido(!sidebarExpandido)} 
      />
      <div className="main-content-container">
        <Navbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}