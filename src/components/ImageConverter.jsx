import React, { useState } from "react";

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState("jpg");
  const [error, setError] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  // Handle format selection
  const handleFormatChange = (e) => {
    setTargetFormat(e.target.value);
  };

  // Convert image
  const convertImage = () => {
    if (!selectedFile) {
      setError("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          const convertedUrl = URL.createObjectURL(blob);
          setConvertedFile(convertedUrl);
        }, `image/${targetFormat}`);
      };
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Image Format Converter
        </h1>

        {/* File Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Convert To
          </label>
          <select
            value={targetFormat}
            onChange={handleFormatChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="png">Webp</option>
            <option value="png">JPEG</option>
          </select>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Convert Button */}
        <button
          onClick={convertImage}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Convert Image
        </button>

        {/* Converted Image Preview */}
        {convertedFile && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Converted Image</h2>
            <img
              src={convertedFile}
              alt="Converted"
              className="w-full rounded-md shadow-sm"
            />
            <a
              href={convertedFile}
              download={`converted-image.${targetFormat}`}
              className="mt-4 inline-block bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
            >
              Download Converted Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageConverter;
