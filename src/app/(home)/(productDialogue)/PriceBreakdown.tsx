import { formatPrice } from "@/lib/utils";

interface PriceBreakdownProps {
    basePrice: number;
    addonsPrice: number;
    quantity?: number;
}

export default function PriceBreakdown({
    basePrice,
    addonsPrice,
    quantity = 1,
}: PriceBreakdownProps) {
    const total = Math.max(0, basePrice + addonsPrice);
    const totalPrice = total * quantity;
    const showQuantity = quantity && quantity > 1;

    return (
        <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-3 text-sm">
            <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                    {formatPrice(basePrice)}
                </span>
            </div>

            {addonsPrice > 0 && (
                <div className="mt-1 flex items-center justify-between">
                    <span className="text-gray-600">Add‑ons</span>
                    <span className="font-semibold text-gray-900">
                        {formatPrice(addonsPrice)}
                    </span>
                </div>
            )}

            <div className="my-2 h-px bg-gray-300" />

            <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">
                    Total {showQuantity && <span className="text-xs text-gray-500">(per item)</span>}
                </span>
                <span className="text-base font-bold text-primary">
                    {formatPrice(total)}
                </span>
            </div>

            {showQuantity && (
                <>
                    <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
                        <span>
                            {formatPrice(total)} × {quantity}
                        </span>
                        <span className="font-semibold text-primary">
                            {formatPrice(totalPrice)}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
