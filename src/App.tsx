import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "@/pages/Home";
import AssetList from "@/pages/AssetList";
import AssetForm from "@/pages/AssetForm";

// 处理安卓硬件返回键的组件
function BackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 只在移动App环境中才处理硬件返回键
    const isCapacitor = typeof window !== "undefined" && (window as any).Capacitor !== undefined;
    if (!isCapacitor) return;

    const handleBackButton = async () => {
      // 如果不是首页，就返回上一页
      if (location.pathname !== "/") {
        navigate(-1);
      } else {
        // 如果是首页，就退出应用
        try {
          const CapApp = (window as any).Capacitor.Plugins.App;
          if (CapApp && CapApp.exitApp) {
            CapApp.exitApp();
          }
        } catch (e) {
          console.error("Failed to exit app:", e);
        }
      }
    };

    // 监听硬件返回键事件
    try {
      const CapApp = (window as any).Capacitor.Plugins.App;
      if (CapApp && CapApp.addListener) {
        const listener = CapApp.addListener("backButton", handleBackButton);
        return () => {
          if (listener && listener.remove) {
            listener.remove();
          }
        };
      }
    } catch (e) {
      console.error("Failed to setup back button listener:", e);
    }
  }, [navigate, location.pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <BackButtonHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assets/:category" element={<AssetList />} />
        <Route path="/assets/add" element={<AssetForm />} /> {/* 统一添加页面 */}
        <Route path="/assets/:category/:id" element={<AssetForm />} />
      </Routes>
    </Router>
  );
}
