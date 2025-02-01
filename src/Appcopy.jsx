import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import ImageConverter from "./components/ImageConverter";

const allowedFormats = [
  { format: "JPEG", display: "JPG", color: "bg-blue-600" },
  { format: "PNG", display: "PNG", color: "bg-red-600" },
  { format: "WEBP", display: "WebP", color: "bg-purple-600" },
];

function App() {
  const [file, setFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const imageFile = acceptedFiles[0];
    if (imageFile) {
      setFile(imageFile);
      setConvertedFile(null);
      setError("");
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
      const newFileName = file.name.replace(/\.[^/.]+$/, `.${extension}`);

      const convertedFile = new File([convertedBlob], newFileName, {
        type: `image/${targetFormat.toLowerCase()}`,
      });

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
      <ImageConverter />
    </div>
  );
}

export default App;
