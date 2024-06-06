import { createContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { lookInSession } from "./common/session";
import Navbar from "./components/navbar.component";
import Sidebar from "./components/sidenavbar.component";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404.page";
import BlogPage from "./pages/blog.page";
import ChangePassword from "./pages/change-password.page";
import ChangeProfilePage from "./pages/change-profile.page";
import EditorPage from "./pages/editor.page";
import Homepage from "./pages/homepage.page";
import ManageBlogPage from "./pages/manage-blog.page";
import NotificationPage from "./pages/notification.page";
import ProfilePage from "./pages/profile.page";
import SearchPage from "./pages/search.page";
import UserAuthForm from "./pages/userAuthForm.page";
import io from "socket.io-client";
import axios from "axios";
import ForgotPassword from "./pages/ForgotPassword";
import NewPassword from "./pages/NewPassword";

export const UserAuth = createContext({});
export const LanguageContext = createContext({});
function App() {
  const [userAuth, setUserAuth] = useState({
    access_token: null,
    username: "",
    profile_img: "",
  });
  const [language, setLanguage] = useState(1);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState(null);
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_SERVER);
    setSocket(socket);
    socket.on("connect", () => {
      console.log(`You are connected with id: ${socket.id}`);
    });
    let userInSession = lookInSession("user");
    if (userInSession) {
      const user = JSON.parse(userInSession);
      setUserAuth(user);

      socket.emit("newUser", { username: user.username });
    } else {
      setUserAuth({ access_token: null });
    }
  }, []);
  return (
    <div>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <UserAuth.Provider
          value={{
            userAuth,
            setUserAuth,
            socket,
            setSocket,
            notifications,
            setNotifications,
          }}
        >
          <Router>
            <Routes>
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/edit/:blog_id" element={<EditorPage />} />
              <Route path="/" element={<Navbar />}>
                <Route index element={<Homepage />} />
                <Route path="dashboard" element={<Sidebar />}>
                  <Route path="blogs" element={<ManageBlogPage />} />
                  <Route path="notifications" element={<NotificationPage />} />
                </Route>
                <Route path="settings" element={<Sidebar />}>
                  <Route path="edit-profile" element={<ChangeProfilePage />} />
                  <Route path="change-password" element={<ChangePassword />} />
                </Route>

                <Route
                  path="signin"
                  element={<UserAuthForm type="sign-in" />}
                />
                <Route
                  path="signup"
                  element={<UserAuthForm type="sign-up" />}
                />
                <Route path="user/:username" element={<ProfilePage />} />
                <Route path="blog/:blog_id" element={<BlogPage />} />
                <Route path="search/:query" element={<SearchPage />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password/:token" element={<NewPassword />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Router>
        </UserAuth.Provider>
      </LanguageContext.Provider>

      <Toaster />
    </div>
  );
}

export default App;
