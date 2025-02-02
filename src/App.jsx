import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ConvertPage from "./pages/ConvertPage";
import ResizePage from "./pages/ResizePage";
import Home from "./pages/Home";
import OptimizePage from "./pages/optimize";

function App() {
  return (
    <Router>
      <nav className="bg-white shadow-lg mb-S8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-primary">
              <span className="text-lg font-bold text-gray-600">Image</span>
              <span className="text-lg font-bold text-primary">Tools</span>
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/convert"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Convert Format
              </Link>
              <Link
                to="/resize"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Resize Image
              </Link>
              <Link
                to="/optimize"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Optimize
              </Link>
            </div>
          </div>
        </div>
      </nav>
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
