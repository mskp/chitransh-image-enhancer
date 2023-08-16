"use client";

import React, { useState } from "react";

export default function Home() {
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [beingDownloaded, setBeingDownloaded] = useState(false);
  const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

  const handleImageUpload = async (event) => {
    event.preventDefault();
    if (!event.target.image?.files[0]) return

    setProcessedImage(null);
    const image = event.target.image.files[0];

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);

    try {
      const response = await fetch(API_HOST, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setLoading(false);

      if (data.uploadedImage && data.processedImage) {
        setProcessedImage(data.processedImage);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const downloadFile = async () => {
    try {
      setBeingDownloaded(true);
      const response = await fetch(
        `${API_HOST}/download/${encodeURIComponent(processedImage)}`
      );
      const data = await response.blob();
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `chitransh-${Date.now()}-cowed.png`;
      link.click();
      setBeingDownloaded(false);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center">
        <form
          onSubmit={handleImageUpload}
          encType="multipart/form-data"
          className="text-center"
        >
          <input
            type="file"
            name="image"
            accept="image/*"
            className="mb-5 p-2 block w-full text-sm text-white border border-black bg-slate-700 rounded-lg cursor-pointer"
          />
          <button
            type="submit"
            style={{ background: "#1a4940" }}
            disabled={loading}
            className="hover:opacity-80 text-white py-2 px-4 rounded disabled:opacity-50 cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
      <div className="flex flex-col md:flex-row justify-center mt-4">
        <div className="w-full md:w-1/2 lg:pl-2 flex flex-col items-center mt-4 md:mt-0">
          {processedImage && (
            <div>
              <h3 className="text-xl mb-2 text-center">Enhanced Image</h3>
              <img
                src={processedImage}
                className="w-full h-auto max-h-96 mb-2"
                alt="Processed"
              />
            </div>
          )}
          {processedImage && (
            <button
              onClick={downloadFile}
              style={{ background: "#1a4940" }}
              className="hover:opacity-80 text-white py-2 px-4 rounded"
            >
              {beingDownloaded ? "Downloading..." : "Download"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// const Button = ({ onClick, disabled, text, loading }) => (
//   <button
//     onClick={onClick}
//     style={{ background: "#1a4940" }}
//     disabled={disabled}
//     className={`hover:opacity-80 text-white py-2 px-4 rounded ${
//       disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'
//     }`}
//   >
//     {loading ? `${text}...` : text}
//   </button>
// );