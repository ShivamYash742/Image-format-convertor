import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const themes = {
  light: {
    background: "bg-gray-100",
    text: "text-gray-800",
    navBackground: "bg-white",
    navShadow: "shadow-lg",
    cardBackground: "bg-white",
    borderColor: "border-gray-300",
    primaryColor: "text-primary",
    secondaryColor: "text-gray-600",
    buttonBg: "bg-gray-100",
    buttonHoverBg: "bg-gray-200",
    errorText: "text-red-600",
    successBg: "bg-green-600",
    successHoverBg: "bg-green-700",
  },
  dark: {
    background: "bg-gray-900",
    text: "text-gray-100",
    navBackground: "bg-gray-800",
    navShadow: "shadow-lg",
    cardBackground: "bg-gray-800",
    borderColor: "border-gray-600",
    primaryColor: "text-primary",
    secondaryColor: "text-gray-400",
    buttonBg: "bg-gray-700",
    buttonHoverBg: "bg-gray-600",
    errorText: "text-red-400",
    successBg: "bg-green-500",
    successHoverBg: "bg-green-600",
  },
};

function OptimizePage() {
  const [file, setFile] = useState(null);
  const [optimizedFile, setOptimizedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const theme = isDarkMode ? themes.dark : themes.light;

  const onDrop = useCallback((acceptedFiles) => {
    const imageFile = acceptedFiles[0];
    if (imageFile) {
      setFile(imageFile);
      setOptimizedFile(null);
      setError("");
      setNewFileName(imageFile.name.replace(/\.[^/.]+$/, ""));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropRejected: (files) => {
      setError("File too large (max 5MB) or invalid format");
    },
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
          const optimizedFile = new File(
            [blob],
            `${newFileName}.${file.type.split("/")[1]}`,
            {
              type: file.type,
            }
          );
          setOptimizedFile(optimizedFile);
          URL.revokeObjectURL(img.src);
        },
        file.type,
        0.7 // Adjust the quality factor to control compression
      );
    } catch (err) {
      setError("Failed to optimize image");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleFileNameChange = (e) => {
    setNewFileName(e.target.value);
  };

  return (
    <div className={`min-h-screen ${theme.background} py-8 px-4`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold text-center ${theme.text}`}>
            Image Optimizer
          </h1>
          <button
            onClick={handleDarkModeToggle}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div
          className={`${theme.cardBackground} rounded-xl ${theme.navShadow} p-6 mb-8`}
        >
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? `border-primary bg-blue-50`
                  : `${theme.borderColor} hover:border-primary`
              }`}
          >
            <input {...getInputProps()} />
            <p className={`${theme.secondaryColor}`}>
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
                <div className="mt-4 w-full">
                  <label className={`${theme.secondaryColor} font-medium`}>
                    New File Name
                  </label>
                  <input
                    type="text"
                    value={newFileName}
                    onChange={handleFileNameChange}
                    className={`w-full mt-2 p-2 border rounded ${theme.text}`}
                  />
                </div>
                <button
                  onClick={handleOptimization}
                  disabled={isProcessing}
                  className={`${theme.buttonBg} ${theme.text} px-6 py-2 rounded-lg hover:${theme.buttonHoverBg} disabled:opacity-50 disabled:cursor-not-allowed mt-4`}
                >
                  {isProcessing ? "Optimizing..." : "Optimize Image"}
                </button>
              </div>

              {optimizedFile && (
                <div className="mt-8">
                  <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>
                    Optimized Image
                  </h3>
                  <div className="flex items-center gap-8">
                    <img
                      src={URL.createObjectURL(optimizedFile)}
                      alt="Optimized"
                      className="max-w-full h-48 object-contain rounded-lg"
                    />
                    <a
                      href={URL.createObjectURL(optimizedFile)}
                      download={
                        newFileName
                          ? `${newFileName}.${optimizedFile.name
                              .split(".")
                              .pop()}`
                          : optimizedFile.name
                      }
                      className={`inline-block ${theme.successBg} text-white px-6 py-2 rounded-lg
                        hover:${theme.successHoverBg} transition-colors font-medium`}
                    >
                      Download Optimized Image
                    </a>
                  </div>
                </div>
              )}

              {error && (
                <div className={`mt-4 ${theme.errorText} font-medium`}>
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OptimizePage;
