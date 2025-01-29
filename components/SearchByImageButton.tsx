"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

async function fetchProductDetails(ids: string[]) {
  const res = await fetch("/api/productsByIds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch product details");
  }
  return res.json();
}

export default function SearchByImageButton() {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      // If running Flask locally: "http://127.0.0.1:5000/visual-search"
      // If deployed: "https://your-flask.onrender.com/visual-search"
      const flaskUrl = "https://ecommerce-recommendation-service.onrender.com/visual-search";

      const res = await fetch(flaskUrl, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("Flask error:", res.status);
        return;
      }
      const data = await res.json();

      const productIds = data.results.map((r: any) => r.productId);
      const products = await fetchProductDetails(productIds);
      setResults(products);
    } catch (err) {
      console.error("Search by image failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* The button to open the modal */}
      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        Search by Image
      </button>

      {/* Modal Overlay */}
      {showModal && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black
            bg-opacity-60
            backdrop-blur-sm
            p-4
          "
        >
          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-white rounded-md shadow-lg p-6">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4">Upload an image</h2>

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Choose file
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4 block w-full text-sm text-gray-900 border border-gray-300
                         rounded-lg cursor-pointer focus:outline-none p-1"
            />

            <button
              onClick={handleSubmit}
              disabled={!selectedFile || isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>

            {/* Results */}
            {results.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Matches:</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {results.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.id}`}
                      onClick={() => setShowModal(false)}
                      className="
                        block border border-gray-200 p-3 rounded-md
                        hover:border-gray-300 hover:shadow-sm
                        transition-shadow cursor-pointer
                      "
                    >
                      <p className="font-medium text-base mb-1">{prod.name}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Price: ${prod.price}
                      </p>
                      {prod.images?.[0]?.url && (
                        <div className="relative w-16 h-16">
                          <Image
                            src={prod.images[0].url}
                            alt={prod.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
