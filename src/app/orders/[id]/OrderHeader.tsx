import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';

interface OrderHeaderProps {
    createdAt: string;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ createdAt }) => {
    return (
        <div className="mb-8">
            <Link href="/orders">
                <Button variant="ghost" className="cursor-pointer mb-4 -ml-2 gap-2 hover:gap-3 transition-all">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Orders
                </Button>
            </Link>
            <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-slate-900">Order Details</h1>
            </div>
            <p className="text-slate-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
                <span className="mx-1">•</span>
                <Clock className="w-4 h-4" />
                {new Date(createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
    );
};

export default OrderHeader;