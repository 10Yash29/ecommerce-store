'use client';

import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import useCart from '@/hooks/use-cart';
import Currency from '@/components/ui/currency';
import { Button } from '@/components/ui/button';

export const Summary = () => {
    const { userId } = useAuth(); // Fetch userId from Clerk
    const searchParams = useSearchParams();
    const items = useCart((state) => state.items);
    const removeAll = useCart((state) => state.deleteAll);

    useEffect(() => {
        if (searchParams.get('success')) {
            toast.success('Your order has been placed!');
            removeAll();
        }

        if (searchParams.get('canceled')) {
            toast.error('Something went wrong, please try again.');
        }
    }, [searchParams, removeAll]);

    const totalPrice = items.reduce((total, item) => total + Number(item.price), 0);

    const onCheckout = async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
                {
                    productIds: items.map((item) => item.id),
                    userId, // Include userId in the payload
                }
            );

            window.location.href = response.data.url; // Redirect to Stripe Checkout
        } catch (error) {
            console.error('CHECKOUT_ERROR:', error);
            toast.error('Failed to initiate checkout.');
        }
    };

    return (
        <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">Order total</div>
                    <Currency value={totalPrice} />
                </div>
            </div>
            <Button
                disabled={items.length === 0}
                onClick={onCheckout}
                className="w-full mt-6"
            >
                Checkout
            </Button>
        </div>
    );
};
