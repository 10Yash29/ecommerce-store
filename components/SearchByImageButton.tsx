"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

async function fetchProductDetails(ids: string[]) {
  const res = await fetch("/api/productsByIds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("Failed to fetch product details");
  return res.json();
}

export default function SearchByImageButton() {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<
    Array<{ product: any; similarity: number; visualScore: number; colorScore: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("https://yash29102004-visual-search.hf.space/visual-search", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      const isJson = contentType?.includes("application/json");

      if (!res.ok) {
        const errorData = isJson ? await res.json() : await res.text();
        throw new Error(isJson ? errorData.error : "Unexpected server error. Check endpoint.");
      }

      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        setError("No similar products found. Try a different image.");
        return;
      }

      const products = await fetchProductDetails(data.results.map((r: any) => r.productId));

      const resultsWithSimilarity = products.map((product: any) => ({
        product,
        similarity: data.results.find((r: any) => r.productId === product.id)?.similarity || 0,
        visualScore: data.results.find((r: any) => r.productId === product.id)?.visualScore || 0,
        colorScore: data.results.find((r: any) => r.productId === product.id)?.colorScore || 0,
      }));

      setResults(resultsWithSimilarity);
    } catch (err) {
      console.error("Search failed:", err);
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2.5 rounded-full bg-primary/90 hover:bg-primary text-sm font-medium text-primary-foreground backdrop-blur-sm transition-all duration-200 ease-out hover:scale-[1.03] active:scale-95 shadow-sm hover:shadow-md"
      >
        Search by Image
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm pt-20 p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-popover/80 rounded-xl backdrop-blur-2xl shadow-2xl animate-scale-in max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-popover border shadow-lg hover:scale-105 transition-transform z-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">Visual Search</h2>
                <p className="text-muted-foreground text-sm">Upload an image to find similar products</p>
              </div>

              <label className="flex flex-col items-center justify-center w-full h-64 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer bg-background/50 hover:bg-background/70 group">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-4 bg-accent/50 rounded-full group-hover:bg-accent transition-colors">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG up to 10MB</p>
                  </div>
                </div>
              </label>

              {error && (
                <div className="text-center py-4 text-destructive">
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!selectedFile || isLoading}
                className="w-full py-4 px-6 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-current" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Searching...</span>
                  </>
                ) : (
                  <span>Find Similar Products</span>
                )}
              </button>

              {results.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Matches ({results.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {results.map(({ product, similarity, visualScore, colorScore }) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={() => setShowModal(false)}
                        className="group flex items-center space-x-4 p-3 bg-background rounded-lg border hover:border-primary hover:shadow-sm transition-all duration-200 relative"
                      >
                        <div className="absolute top-2 right-2 space-y-1 text-xs">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Visual: {Math.round(visualScore * 100)}%
                          </span>
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Color: {Math.round(colorScore * 100)}%
                          </span>
                        </div>

                        {product.images?.[0]?.url && (
                          <div className="relative w-16 h-16 rounded-md overflow-hidden">
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">₹{product.price}</p>
                        </div>

                        <svg
                          className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
