import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TriangleAlert, ChevronLeft } from 'lucide-react';

interface PaymentErrorPageProps {
    message?: string; // Optional message prop
}

const PaymentErrorPage: React.FC<PaymentErrorPageProps> = ({ message }) => {
    const defaultMessage = "We encountered an issue processing your payment or fetching order details. Please try again or contact support.";
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-2xl">
                <Card className="border-2 shadow-lg">
                    <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                            <TriangleAlert className="w-10 h-10 text-red-500" />
                        </div>
                        <h1 className="text-3xl font-bold mb-3 text-red-800">Payment Error</h1>
                        <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                            {message || defaultMessage}
                        </p>
                        <Link href="/orders">
                            <Button size="lg" className="gap-2">
                                <ChevronLeft className="w-4 h-4" />
                                View All Orders
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PaymentErrorPage;