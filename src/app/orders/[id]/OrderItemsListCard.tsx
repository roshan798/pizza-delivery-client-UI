import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Receipt } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { OrderResponseDto } from '@/types/order-types';

interface OrderItemsListCardProps {
    items: OrderResponseDto['items'];
}

const OrderItemsListCard: React.FC<OrderItemsListCardProps> = ({ items }) => {
    return (
        <Card className="mb-6 border-2 shadow-md">
            <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-purple-100">
                        <Receipt className="w-5 h-5 text-purple-600" />
                    </div>
                    Order Items
                    <Badge variant="secondary" className="ml-auto">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="p-5 hover:bg-slate-50/50 transition-colors flex justify-between items-center gap-4"
                        >
                            <div className="flex-1">
                                <p className="font-semibold text-slate-900 mb-1">{item.productName}</p>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Badge variant="outline" className="font-normal">{item.base.name}</Badge>
                                    <span>×</span>
                                    <span className="font-medium">{item.quantity}</span>
                                </div>
                            </div>
                            <p className="text-lg font-bold text-slate-900">₹{formatPrice(item.itemTotal)}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderItemsListCard;