'use client'; // Because we use useState/useEffect

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Products } from "@/types";
import ProductCard from "@/components/ProductCard";

interface RecommendedProductsProps {
  title?: string;
  limit?: number;
}
export default function RecommendedProducts({ title = "Recommended for You", limit = 8 }: RecommendedProductsProps) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Products[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;

    // 1) Fetch recommended product IDs from Flask
    fetch(`http://127.0.0.1:5000/recommend/${userId}`)
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    const recIds = data.recommendedProducts || [];
    setProductIds(recIds);
  })
  .catch(err => {
    console.error("Failed to fetch recommendations:", err);
  });
  }, [userId]);

  useEffect(() => {
    if (productIds.length === 0) return;
    fetch(`/api/productsByIds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: productIds.slice(0, limit) }),
    })
    .then(res => res.json())
    .then((data: Products[]) => {
      setProducts(data);
    })
    .catch(err => {
      console.error("Failed to fetch product details:", err);
    });
  }, [productIds, limit]);

  if (products.length === 0) {
    return null; // or some fallback
  }

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((prod) => (
          <ProductCard key={prod.id} data={prod} />
        ))}
      </div>
    </div>
  );
}
