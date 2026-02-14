import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const OrderLoadingSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Loading skeleton for stepper */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-20 w-20 rounded-full" />
                        ))}
                    </div>
                </div>
                <div className="mb-8">
                    <Skeleton className="h-10 w-48 mb-4" />
                    <Skeleton className="h-6 w-32" />
                </div>

                <Card className="mb-6 border-2">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <Skeleton className="h-8 w-40" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                        <Skeleton className="h-4 w-64" />
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <Card className="border-2">
                        <CardContent className="p-6">
                            <Skeleton className="h-6 w-32 mb-4" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                    </Card>
                    <Card className="border-2">
                        <CardContent className="p-6">
                            <Skeleton className="h-6 w-32 mb-4" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderLoadingSkeleton;