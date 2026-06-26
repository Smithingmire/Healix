import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LandingPage from "./components/home/LandingPage";
import LoginScreen from "./components/home/LoginScreen";
import Portal from "./components/dashboard/Portal";
import { UserSession } from "./types";

function AppRoutes({ 
  user, 
  theme, 
  handleThemeChange, 
  handleLoginSuccess, 
  handleLogout 
}: {
  user: UserSession | null;
  theme: "light" | "dark";
  handleThemeChange: (newTheme: "light" | "dark") => void;
  handleLoginSuccess: (loggedInUser: UserSession) => void;
  handleLogout: () => void;
}) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <LandingPage 
            onLogin={() => navigate("/login")} 
            theme={theme} 
            onThemeChange={handleThemeChange} 
          />
        } 
      />
      <Route 
        path="/login" 
        element={
          user ? (
            <Navigate to="/portal" replace />
          ) : (
            <LoginScreen 
              onLoginSuccess={(loggedInUser) => {
                handleLoginSuccess(loggedInUser);
                navigate("/portal");
              }} 
              onBack={() => navigate("/")} 
              theme={theme} 
              onThemeChange={handleThemeChange} 
            />
          )
        } 
      />
      <Route 
        path="/portal" 
        element={
          user ? (
            <Portal 
              activeTab="chat"
              onLogout={() => {
                handleLogout();
                navigate("/login");
              }} 
              user={user} 
              theme={theme} 
              onThemeChange={handleThemeChange} 
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/portal/reports" 
        element={
          user ? (
            <Portal 
              activeTab="report-saver"
              onLogout={() => {
                handleLogout();
                navigate("/login");
              }} 
              user={user} 
              theme={theme} 
              onThemeChange={handleThemeChange} 
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/portal/schemes" 
        element={
          user ? (
            <Portal 
              activeTab="schemes"
              onLogout={() => {
                handleLogout();
                navigate("/login");
              }} 
              user={user} 
              theme={theme} 
              onThemeChange={handleThemeChange} 
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/portal/resources" 
        element={
          user ? (
            <Portal 
              activeTab="resources"
              onLogout={() => {
                handleLogout();
                navigate("/login");
              }} 
              user={user} 
              theme={theme} 
              onThemeChange={handleThemeChange} 
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/portal/misinformation" 
        element={
          user ? (
            <Portal 
              activeTab="misinformation"
              onLogout={() => {
                handleLogout();
                navigate("/login");
              }} 
              user={user} 
              theme={theme} 
              onThemeChange={handleThemeChange} 
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/portal/profile" 
        element={
          user ? (
            <Portal 
              activeTab="profile"
              onLogout={() => {
                handleLogout();
                navigate("/login");
              }} 
              user={user} 
              theme={theme} 
              onThemeChange={handleThemeChange} 
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/portal/whatsapp" 
        element={
          user ? (
            <Portal 
              activeTab="whatsapp-bot"
              onLogout={() => {
                handleLogout();
                navigate("/login");
              }} 
              user={user} 
              theme={theme} 
              onThemeChange={handleThemeChange} 
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      {/* Fallback routing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const [user, setUser] = useState<UserSession | null>(() => {
    const savedUser = localStorage.getItem("healix_active_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load and apply theme dynamically per user
  useEffect(() => {
    const themeKey = user ? `healix_theme_${user.email || user.phone}` : "healix_theme_global";
    const savedTheme = localStorage.getItem(themeKey) as "light" | "dark" | null;
    const initialTheme = savedTheme || "light";
    setTheme(initialTheme);
    
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [user]);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    const themeKey = user ? `healix_theme_${user.email || user.phone}` : "healix_theme_global";
    localStorage.setItem(themeKey, newTheme);
    localStorage.setItem("healix_theme_global", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLoginSuccess = (loggedInUser: UserSession) => {
    setUser(loggedInUser);
    localStorage.setItem("healix_active_user", JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("healix_active_user");
  };

  return (
    <BrowserRouter>
      <AppRoutes 
        user={user}
        theme={theme}
        handleThemeChange={handleThemeChange}
        handleLoginSuccess={handleLoginSuccess}
        handleLogout={handleLogout}
      />
    </BrowserRouter>
  );
}


