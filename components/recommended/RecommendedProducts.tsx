'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Products } from "@/types";
import ProductCard from "@/components/ProductCard";

interface RecommendedProductsProps {
  title?: string;
  limit?: number;
}


const RECO_URL =
  process.env.NEXT_PUBLIC_RECO_URL ??
  "https://one0yash29-ecommerce-recommendation.onrender.com";

export default function RecommendedProducts({ title = "Recommended for You", limit = 8 }: RecommendedProductsProps) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Products[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;
    const ac = new AbortController();

    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${RECO_URL}/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ userId, numRecommendations: limit }),
          signal: ac.signal,
        });
        if (!res.ok) {
          let msg = `HTTP error! status: ${res.status}`;
          try {
            const err = await res.json();
            if (err?.error) msg = err.error;
          } catch { /* ignore */ }
          throw new Error(msg);
        }
        const data = await res.json();
        const ids: string[] = (data.recommendations ?? []).map((r: any) => r.productId);
        setProductIds(ids);
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          console.error("Failed to fetch recommendations:", err);
          setProductIds([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
    return () => ac.abort();
  }, [userId, limit]);


  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      return;
    }
    const ac = new AbortController();

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/productsByIds`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ ids: productIds.slice(0, limit) }),
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: Products[] = await res.json();
        setProducts(data);
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          console.error("Failed to fetch product details:", err);
          setProducts([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    return () => ac.abort();
  }, [productIds, limit]);

  if (isLoading) {
    return <div>Loading recommendations...</div>;
  }
  if (!products.length) {
    return <div>No recommendations available at the moment.</div>;
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
