import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

export default function OptimizePage() {
  const [file, setFile] = useState(null);
  const [optimizedFile, setOptimizedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [customFileName, setCustomFileName] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    try {
      const imageFile = acceptedFiles[0];
      if (imageFile) {
        setFile(imageFile);
        setOptimizedFile(null);
        setError("");
      }
    } catch (err) {
      setError("Error occurred while setting file state");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleOptimization = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError("");

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0, img.width, img.height);

      canvas.toBlob(
        (blob) => {
          const optimizedFile = new File([blob], `optimized-${file.name}`, {
            type: file.type,
          });
          setOptimizedFile(optimizedFile);
          URL.revokeObjectURL(img.src);
        },
        file.type,
        0.7
      ); // Adjust the quality factor to control compression
    } catch (err) {
      setError("Failed to optimize image");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleFileNameChange = (e) => {
    setCustomFileName(e.target.value);
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="max-w-3xl w-full px-4">
        <h1
          className={`text-4xl font-bold text-center my-8 ${
            darkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Image Optimizer
        </h1>

        <div
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 ${
            darkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          <button
            className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-2 py-1 rounded-md"
            onClick={handleDarkModeToggle}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-blue-50"
                : "border-gray-300 hover:border-primary"
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-gray-600 dark:text-gray-300">
              {isDragActive
                ? "Drop the image here"
                : "Drag & drop an image, or click to select"}
            </p>
          </div>

          {file && (
            <div className="mt-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-4">Original Image</h3>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Original"
                    className="max-w-full h-48 object-contain rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-4">
                    Optimize Settings
                  </h3>
                  <button
                    onClick={handleOptimization}
                    disabled={isProcessing}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
                  >
                    {isProcessing ? "Optimizing..." : "Optimize Image"}
                  </button>
                </div>
              </div>

              {optimizedFile && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Optimized Image
                  </h3>
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <img
                      src={URL.createObjectURL(optimizedFile)}
                      alt="Optimized"
                      className="max-w-full h-48 object-contain rounded-lg"
                    />
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="Enter file name (optional)"
                        value={customFileName}
                        onChange={handleFileNameChange}
                        className="w-full p-2 border rounded"
                      />
                      <a
                        href={URL.createObjectURL(optimizedFile)}
                        download={
                          customFileName
                            ? `${customFileName}.${optimizedFile.name
                                .split(".")
                                .pop()}`
                            : optimizedFile.name
                        }
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                      >
                        Download Optimized Image
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 text-red-600 font-medium">{error}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
