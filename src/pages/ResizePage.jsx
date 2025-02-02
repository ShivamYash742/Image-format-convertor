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

export default function ResizePage() {
  const [file, setFile] = useState(null);
  const [resizedFile, setResizedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dimensions, setDimensions] = useState({
    width: "",
    height: "",
    maintainAspect: true,
  });
  const [newFileName, setNewFileName] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = isDarkMode ? themes.dark : themes.light;

  const onDrop = useCallback((acceptedFiles) => {
    try {
      const imageFile = acceptedFiles[0];
      if (imageFile) {
        setFile(imageFile);
        setResizedFile(null);
        setError("");
        setNewFileName(imageFile.name.replace(/\.[^/.]+$/, ""));
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

  const handleResize = async () => {
    if (!file || !dimensions.width || !dimensions.height) return;

    setIsProcessing(true);
    setError("");

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Calculate new dimensions
      let newWidth = parseInt(dimensions.width);
      let newHeight = parseInt(dimensions.height);

      if (dimensions.maintainAspect) {
        const aspectRatio = img.width / img.height;
        if (newWidth && !newHeight) {
          newHeight = newWidth / aspectRatio;
        } else if (newHeight && !newWidth) {
          newWidth = newHeight * aspectRatio;
        }
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob((blob) => {
        const resizedFile = new File(
          [blob],
          `${newFileName}.${file.type.split("/")[1]}`,
          {
            type: file.type,
          }
        );
        setResizedFile(resizedFile);
        URL.revokeObjectURL(img.src);
      }, file.type);
    } catch (err) {
      setError("Failed to resize image");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    return () => {
      const img = document.querySelector("img");
      if (img) {
        URL.revokeObjectURL(img.src);
      }
      const canvas = document.querySelector("canvas");
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, []);

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setDimensions((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaintainAspectChange = (e) => {
    const { checked } = e.target;
    setDimensions((prev) => ({ ...prev, maintainAspect: checked }));
  };

  return (
    <div className={`min-h-screen ${theme.background} py-8 px-4`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold text-center ${theme.text}`}>
            Image Resizer
          </h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
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
            <div className="mt-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>
                    Original Image
                  </h3>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Original"
                    className="max-w-full h-48 object-contain rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>
                    Resize Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block mb-2 ${theme.text}`}>
                        Width (px)
                      </label>
                      <input
                        type="number"
                        value={dimensions.width}
                        onChange={handleDimensionChange}
                        name="width"
                        className={`w-full p-2 border rounded ${theme.text}`}
                      />
                    </div>
                    <div>
                      <label className={`block mb-2 ${theme.text}`}>
                        Height (px)
                      </label>
                      <input
                        type="number"
                        value={dimensions.height}
                        onChange={handleDimensionChange}
                        name="height"
                        className={`w-full p-2 border rounded ${theme.text}`}
                      />
                    </div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={dimensions.maintainAspect}
                        onChange={handleMaintainAspectChange}
                      />
                      <span className={theme.text}>Maintain Aspect Ratio</span>
                    </label>
                    <div>
                      <label className={`${theme.secondaryColor} font-medium`}>
                        New File Name
                      </label>
                      <input
                        type="text"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        className={`w-full p-2 border rounded ${theme.text}`}
                      />
                    </div>
                    <button
                      onClick={handleResize}
                      disabled={isProcessing}
                      className={`${theme.buttonBg} ${theme.text} px-6 py-2 rounded-lg hover:${theme.buttonHoverBg} disabled:opacity-50 disabled:cursor-not-allowed mt-4`}
                    >
                      {isProcessing ? "Resizing..." : "Resize Image"}
                    </button>
                  </div>
                </div>
              </div>

              {resizedFile && (
                <div className="mt-8">
                  <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>
                    Resized Image
                  </h3>
                  <div className="flex items-center gap-8">
                    <img
                      src={URL.createObjectURL(resizedFile)}
                      alt="Resized"
                      className="max-w-full h-48 object-contain rounded-lg"
                    />
                    <a
                      href={URL.createObjectURL(resizedFile)}
                      download={resizedFile.name}
                      className={`inline-block ${theme.successBg} text-white px-6 py-2 rounded-lg
                      hover:${theme.successHoverBg} transition-colors font-medium`}
                    >
                      Download Resized Image
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
