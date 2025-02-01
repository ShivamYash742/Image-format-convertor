import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="bg-white shadow-lg mb-8">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
