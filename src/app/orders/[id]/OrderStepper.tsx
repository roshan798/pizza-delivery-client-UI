import { OrderStatus } from "@/types/order-types";
import { CheckCircle2, Clock, Package, Truck } from "lucide-react";

interface OrderStepperProps {
    status: OrderStatus;
}

const OrderStepper: React.FC<OrderStepperProps> = ({ status }) => {
    const steps = [
        { id: OrderStatus.PENDING, label: 'Pending', icon: Clock },
        { id: OrderStatus.VERIFIED, label: 'Verified', icon: CheckCircle2 },
        { id: OrderStatus.CONFIRMED, label: 'Confirmed', icon: CheckCircle2 },
        { id: OrderStatus.PREPARING, label: 'Preparing', icon: Package },
        { id: OrderStatus.OUT_FOR_DELIVERY, label: 'Out for Delivery', icon: Truck },
        { id: OrderStatus.DELIVERED, label: 'Delivered', icon: CheckCircle2 }
    ];

    const getStepStatus = (stepStatus: OrderStatus) => {
        if (stepStatus === status) return 'current';
        return steps.findIndex(step => step.id === status) >= steps.findIndex(step => step.id === stepStatus) ? 'completed' : 'pending';
    };

    return (
        <div className="mb-8">
            <div className="relative">
                <div className="flex items-center justify-between mb-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const stepStatus = getStepStatus(step.id as OrderStatus);
                        const isCompleted = stepStatus === 'completed';
                        const isCurrent = stepStatus === 'current';
                        console.log(stepStatus)
                        return (
                            <div key={step.id} className="flex flex-col items-center flex-1 relative">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 shadow-md ${isCompleted ? 'bg-emerald-100 text-emerald-600 border-emerald-300' :
                                        isCurrent ? 'bg-blue-100 text-blue-600 border-blue-300' :
                                            'bg-slate-100 text-slate-400 border-slate-200'
                                    } border-4`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium text-slate-600 text-center leading-tight px-1">
                                    {step.label}
                                </span>
                                {/* Connector line */}
                                {index < steps.length - 1 && (
                                    <div className={`absolute top-12 left-[50%] w-4 h-1 transform -translate-x-1/2 bg-gradient-to-r ${isCompleted ? 'bg-emerald-300' : 'bg-slate-200'
                                        }`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrderStepper;