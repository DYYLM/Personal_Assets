import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import AssetList from "@/pages/AssetList";
import AssetForm from "@/pages/AssetForm";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assets/:category" element={<AssetList />} />
        <Route path="/assets/add" element={<AssetForm />} /> {/* 统一添加页面 */}
        <Route path="/assets/:category/:id" element={<AssetForm />} />
      </Routes>
    </Router>
  );
}
