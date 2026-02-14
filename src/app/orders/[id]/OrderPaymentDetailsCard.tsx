import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Tag } from 'lucide-react';

interface OrderPaymentDetailsCardProps {
    paymentMode: string;
    paymentStatus: string;
    couponCode?: string;
}

const OrderPaymentDetailsCard: React.FC<OrderPaymentDetailsCardProps> = ({ paymentMode, paymentStatus, couponCode }) => {
    return (
        <Card className="border-2 hover:border-slate-300 transition-colors shadow-md">
            <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-emerald-100">
                        <CreditCard className="w-5 h-5 text-emerald-600" />
                    </div>
                    Payment Details
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Payment Method</p>
                    <p className="text-slate-900 font-medium">{paymentMode}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Payment Status</p>
                    <Badge variant="outline" className="font-medium">
                        {paymentStatus}
                    </Badge>
                </div>
                {couponCode && (
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Coupon Applied</p>
                        <p className="text-emerald-600 font-semibold flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            {couponCode}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderPaymentDetailsCard;