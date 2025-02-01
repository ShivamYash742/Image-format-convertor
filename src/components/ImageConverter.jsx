import React, { useState } from "react";

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFormat, setImageFormat] = useState("");
  const [convertedFile, setConvertedFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState("jpg");
  const [error, setError] = useState("");

  // Detect file type
  const detectFormat = (file) => {
    const fileType = file.type.split("/")[1]; // Extract format (e.g., 'png', 'jpeg')
    setImageFormat(fileType);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      detectFormat(file);
      setSelectedFile(file);
      setError("");
    }
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
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-xl w-full bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
            Image Format Converter
          </h1>

          {/* File Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Detected Format */}
          {imageFormat && (
            <p className="text-sm text-gray-600 mb-4">
              Detected Format:{" "}
              <span className="font-semibold">{imageFormat.toUpperCase()}</span>
            </p>
          )}

          {/* Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Convert To
            </label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
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
              <h2 className="text-xl font-semibold mb-4 text-green-600">
                Converted Image
              </h2>
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
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Image Format Converter
          </h1>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-primary bg-blue-50"
                  : "border-gray-300 hover:border-primary"
              }`}
            >
              <input {...getInputProps()} />
              <p className="text-gray-600">
                {isDragActive
                  ? "Drop the image here"
                  : "Drag & drop an image, or click to select"}
              </p>
            </div>

            {file && (
              <div className="mt-6">
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="max-w-full h-48 object-contain rounded-lg"
                  />
                  <p className="text-gray-700">
                    Current format:{" "}
                    <span className="font-semibold">{currentFormat}</span>
                  </p>

                  <div className="flex flex-wrap gap-4 justify-center">
                    {allowedFormats
                      .filter((fmt) => fmt.format !== currentFormat)
                      .map((fmt) => (
                        <button
                          key={fmt.format}
                          onClick={() => convertImage(fmt.format)}
                          disabled={isConverting}
                          className={`${fmt.color} text-white px-6 py-2 rounded-lg font-medium
                          hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          Convert to {fmt.display}
                        </button>
                      ))}
                  </div>
                </div>

                {isConverting && (
                  <div className="mt-6 text-center text-gray-600">
                    <svg
                      className="animate-spin h-6 w-6 mx-auto mb-2 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Converting...
                  </div>
                )}

                {error && (
                  <div className="mt-4 text-center text-red-600 font-medium">
                    {error}
                  </div>
                )}

                {convertedFile && (
                  <div className="mt-6 text-center">
                    <a
                      href={URL.createObjectURL(convertedFile)}
                      download={convertedFile.name}
                      className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg
                      hover:bg-green-700 transition-colors font-medium"
                    >
                      Download {convertedFile.name}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageConverter;
