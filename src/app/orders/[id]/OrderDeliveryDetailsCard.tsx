import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone } from 'lucide-react';

interface OrderDeliveryDetailsCardProps {
    address: string;
    phone: string;
    tenantId: string;
}

const OrderDeliveryDetailsCard: React.FC<OrderDeliveryDetailsCardProps> = ({ address, phone, tenantId }) => {
    return (
        <Card className="border-2 hover:border-slate-300 transition-colors shadow-md">
            <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-blue-100">
                        <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    Delivery Details
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Address</p>
                    <p className="text-slate-900 leading-relaxed">{address}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                    <p className="text-slate-900 font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {phone}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Tenant ID</p>
                    <p className="text-slate-900 font-mono text-sm">{tenantId}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderDeliveryDetailsCard;