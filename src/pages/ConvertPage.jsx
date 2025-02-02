import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const allowedFormats = [
  { format: "JPEG", display: "JPG", color: "bg-blue-600" },
  { format: "PNG", display: "PNG", color: "bg-red-600" },
  { format: "WEBP", display: "WebP", color: "bg-purple-600" },
];

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

function ConvertPage() {
  const [file, setFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = isDarkMode ? themes.dark : themes.light;

  const onDrop = useCallback((acceptedFiles) => {
    const imageFile = acceptedFiles[0];
    if (imageFile) {
      setFile(imageFile);
      setConvertedFile(null);
      setError("");
      setNewFileName(imageFile.name.replace(/\.[^/.]+$/, ""));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    onDropRejected: (files) => {
      setError("File too large (max 5MB) or invalid format");
    },
  });

  const getExtension = (format) => {
    switch (format) {
      case "JPEG":
        return "jpg";
      case "PNG":
        return "png";
      case "WEBP":
        return "webp";
      default:
        return "";
    }
  };

  const convertUsingCanvas = async (targetFormat) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");

        // Handle transparency for JPEG
        if (targetFormat === "JPEG") {
          ctx.fillStyle = "#ffffff"; // White background
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Conversion failed"));
            resolve(blob);
          },
          `image/${targetFormat.toLowerCase()}`,
          0.9 // Quality
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const convertImage = async (targetFormat) => {
    if (!file) return;

    setIsConverting(true);
    setError("");

    try {
      const convertedBlob = await convertUsingCanvas(targetFormat);

      const extension = getExtension(targetFormat);
      const newFileNameWithExtension = `${newFileName}.${extension}`;

      const convertedFile = new File(
        [convertedBlob],
        newFileNameWithExtension,
        {
          type: `image/${targetFormat.toLowerCase()}`,
        }
      );

      setConvertedFile(convertedFile);
    } catch (err) {
      console.error("Conversion error:", err);
      setError(`Failed to convert: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  const currentFormat = file?.type.split("/")[1]?.toUpperCase() || "";

  return (
    <div className={`min-h-screen ${theme.background} py-8 px-4`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold text-center ${theme.text}`}>
            Image Format Converter
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
            <div className="mt-6">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="max-w-full h-48 object-contain rounded-lg"
                />
                <p className={`${theme.secondaryColor}`}>
                  Current format:{" "}
                  <span className="font-semibold">{currentFormat}</span>
                </p>

                <div className="mt-4 w-full">
                  <label className={`${theme.secondaryColor} font-medium`}>
                    New File Name
                  </label>
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className={`w-full mt-2 p-2 border rounded ${theme.text}`}
                  />
                </div>

                <div className="flex flex-wrap gap-4 justify-center mt-4">
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
                <div className={`mt-6 text-center ${theme.secondaryColor}`}>
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
                <div
                  className={`mt-4 text-center ${theme.errorText} font-medium`}
                >
                  {error}
                </div>
              )}

              {convertedFile && (
                <div className="mt-6 text-center">
                  <a
                    href={URL.createObjectURL(convertedFile)}
                    download={convertedFile.name}
                    className={`inline-block ${theme.successBg} text-white px-6 py-2 rounded-lg
                        hover:${theme.successHoverBg} transition-colors font-medium`}
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
  );
}

export default ConvertPage;
