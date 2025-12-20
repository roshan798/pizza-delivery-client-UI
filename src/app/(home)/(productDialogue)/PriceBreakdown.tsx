import { formatPrice } from "@/lib/utils";

interface PriceBreakdownProps {
    basePrice: number;
    addonsPrice: number;
    quantity: number | undefined;
}
export default function PriceBreakdown({
    basePrice,
    addonsPrice,
    quantity = 1,
}: PriceBreakdownProps) {
    const total = Math.max(0, basePrice + addonsPrice);
    const totalPrice = total * quantity;

    return (
        <div className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
            <span>{formatPrice(basePrice)}</span>
            {addonsPrice > 0 &&
                <>
                    <span className="text-primaryfont-bold">+</span>
                    <span>{formatPrice(addonsPrice)}</span>
                </>}
            <span className="text-primary font-bold">=</span>
            <span>{formatPrice(total)}</span>

            {quantity > 1 && (
                <>
                    <span className="text-gray-600">×</span>
                    <span className="font-medium">{quantity}</span>
                    <span className="text-primary font-bold">=</span>
                    <span className="text-primary text-base font-bold">
                        {formatPrice(totalPrice)}
                    </span>
                </>
            )}
        </div>
    );
}
