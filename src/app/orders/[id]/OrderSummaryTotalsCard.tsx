import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { OrderResponseDto } from '@/types/order-types';

interface OrderSummaryTotalsCardProps {
    amounts: OrderResponseDto['amounts'];
}

const OrderSummaryTotalsCard: React.FC<OrderSummaryTotalsCardProps> = ({ amounts }) => {
    return (
        <Card className="border-2 shadow-lg">
            <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-3 text-base">
                    <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-medium">₹{formatPrice(amounts.subTotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>Tax</span>
                        <span className="font-medium">₹{formatPrice(amounts.tax)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>Delivery Charge</span>
                        <span className="font-medium">₹{formatPrice(amounts.deliveryCharge)}</span>
                    </div>
                    {amounts.discount > 0 && (
                        <div className="flex justify-between text-emerald-600">
                            <span className="flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                Discount
                            </span>
                            <span className="font-semibold">- ₹{formatPrice(amounts.discount)}</span>
                        </div>
                    )}
                    <Separator className="!my-4" />
                    <div className="flex justify-between text-xl font-bold text-slate-900 pt-2">
                        <span>Total Amount</span>
                        <span>₹{formatPrice(amounts.grandTotal)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderSummaryTotalsCard;