import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

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

  const onDrop = useCallback((acceptedFiles) => {
    try {
      const imageFile = acceptedFiles[0];
      if (imageFile) {
        setFile(imageFile);
        setResizedFile(null);
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
        const resizedFile = new File([blob], `resized-${file.name}`, {
          type: file.type,
        });
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
    <div>
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center my-8">Image Resizer</h1>

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
                    Resize Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2">Width (px)</label>
                      <input
                        type="number"
                        value={dimensions.width}
                        onChange={handleDimensionChange}
                        name="width"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Height (px)</label>
                      <input
                        type="number"
                        value={dimensions.height}
                        onChange={handleDimensionChange}
                        name="height"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={dimensions.maintainAspect}
                        onChange={handleMaintainAspectChange}
                      />
                      <span>Maintain Aspect Ratio</span>
                    </label>
                    <button
                      onClick={handleResize}
                      disabled={isProcessing}
                      className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
                    >
                      {isProcessing ? "Resizing..." : "Resize Image"}
                    </button>
                  </div>
                </div>
              </div>

              {resizedFile && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Resized Image</h3>
                  <div className="flex items-center gap-8">
                    <img
                      src={URL.createObjectURL(resizedFile)}
                      alt="Resized"
                      className="max-w-full h-48 object-contain rounded-lg"
                    />
                    <a
                      href={URL.createObjectURL(resizedFile)}
                      download={resizedFile.name}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                      Download Resized Image
                    </a>
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
