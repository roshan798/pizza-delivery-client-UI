import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types/order-types';
import { CheckCircle2, Clock, Package, Truck } from 'lucide-react';

interface OrderStatusOverviewCardProps {
    orderId: string;
    orderStatus: OrderStatus;
}

const getStatusConfig = (status: OrderStatus) => {
    const configs = {
        [OrderStatus.DELIVERED]: {
            icon: CheckCircle2,
            color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            label: 'Delivered'
        },
        [OrderStatus.CANCELLED]: {
            icon: CheckCircle2,
            color: 'bg-rose-50 text-rose-700 border-rose-200',
            label: 'Cancelled'
        },
        [OrderStatus.PENDING]: {
            icon: Clock,
            color: 'bg-amber-50 text-amber-700 border-amber-200',
            label: 'Pending'
        },
        [OrderStatus.VERIFIED]: {
            icon: CheckCircle2,
            color: 'bg-blue-50 text-blue-700 border-blue-200',
            label: 'Verified'
        },
        [OrderStatus.PREPARING]: {
            icon: Package,
            color: 'bg-orange-50 text-orange-700 border-orange-200',
            label: 'Preparing'
        },
        [OrderStatus.OUT_FOR_DELIVERY]: {
            icon: Truck,
            color: 'bg-blue-50 text-blue-700 border-blue-200',
            label: 'Out for Delivery'
        },
        [OrderStatus.CONFIRMED]: {
            icon: CheckCircle2,
            color: 'bg-purple-50 text-purple-700 border-purple-200',
            label: 'Confirmed'
        }
    };
    return configs[status] || configs[OrderStatus.PENDING];
};

const OrderStatusOverviewCard: React.FC<OrderStatusOverviewCardProps> = ({ orderId, orderStatus }) => {
    const statusConfig = getStatusConfig(orderStatus);
    return (
        <Card className="mb-6 border-2 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-2">Order Number</p>
                        <p className="text-2xl font-bold font-mono text-slate-900">#{orderId}</p>
                    </div>
                    <Badge
                        className={`${statusConfig.color} border px-4 py-2 text-sm font-semibold flex items-center gap-2 shadow-sm`}
                    >
                        {statusConfig.label}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderStatusOverviewCard;