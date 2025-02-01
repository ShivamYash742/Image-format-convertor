import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto mt-20 text-center">
      <h1 className="text-6xl font-bold mb-8 text-blue-500">
        Image Processing Tools
      </h1>
      <p className="text-lg font-medium mb-12 text-gray-600">
        Effortlessly convert, resize, and optimize your images
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/convert"
          className="bg-blue-100 p-8 rounded-xl hover:bg-blue-200 transition-colors shadow-md"
        >
          <h2 className="text-3xl font-semibold mb-4 text-blue-500">
            Format Converter
          </h2>
          <p className="text-lg text-gray-600">
            Convert between JPG, PNG, WebP, and more formats
          </p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md">
            Convert Now
          </button>
        </Link>
        <Link
          to="/resize"
          className="bg-green-100 p-8 rounded-xl hover:bg-green-200 transition-colors shadow-md"
        >
          <h2 className="text-3xl font-semibold mb-4 text-green-500">
            Image Resizer
          </h2>
          <p className="text-lg text-gray-600">
            Change image dimensions while maintaining quality
          </p>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-md">
            Resize Now
          </button>
        </Link>
        <Link
          to="/optimize"
          className="bg-yellow-100 p-8 rounded-xl hover:bg-yellow-200 transition-colors shadow-md"
        >
          <h2 className="text-3xl font-semibold mb-4 text-yellow-500">
            Image Optimizer
          </h2>
          <p className="text-lg text-gray-600">
            Compress images without losing quality
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded shadow-md m-4.5">
            Optimize Now
          </button>
        </Link>
      </div>
    </div>
  );
}
