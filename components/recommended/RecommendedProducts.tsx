'use client';

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
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;

    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`https://one0yash29-ecommerce-recommendation.onrender.com/recommend/${userId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const recIds = data.recommendedProducts || [];
        setProductIds(recIds);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  useEffect(() => {
    if (productIds.length === 0) return;

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/productsByIds`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: productIds.slice(0, limit) }),
        });
        const data: Products[] = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [productIds, limit]);

  if (isLoading) {
    return <div>Loading recommendations...</div>; // Add a spinner or skeleton UI here
  }
  if (products.length === 0) {
    return <div>No recommendations available at the moment.</div>; // Friendly fallback UI
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
