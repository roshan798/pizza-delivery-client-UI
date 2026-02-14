import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ChevronLeft } from 'lucide-react';

const OrderNotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-2xl">
                <Card className="border-2 shadow-lg">
                    <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                            <Package className="w-10 h-10 text-slate-400" />
                        </div>
                        <h1 className="text-3xl font-bold mb-3 text-slate-900">Order Not Found</h1>
                        <p className="text-slate-600 mb-8 text-lg">
                            We couldn&apos;t find this order or you don&apos;t have permission to view it.
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

export default OrderNotFound;