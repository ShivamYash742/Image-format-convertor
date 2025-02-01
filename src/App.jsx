import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import ConvertPage from "./pages/ConvertPage";
import ResizePage from "./pages/ResizePage";
import Home from "./pages/Home";
import OptimizePage from "./pages/optimize";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resize" element={<ResizePage />} />
        <Route path="/convert" element={<ConvertPage />} />
        <Route path="/optimize" element={<OptimizePage />} />
      </Routes>
    </Router>
  );
}

export default App;
