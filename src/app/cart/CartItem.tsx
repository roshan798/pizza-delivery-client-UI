"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Cart, decrementProductQuantity, incrementProductQuantity, removeFromCart } from "@/lib/cart/cartSlices";
import { useAppDispatch } from "@/lib/hooks";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CartItemProps {
    item: Cart;
    index: number;
}

export function CartItem({ item, index }: CartItemProps) {
    const dispatch = useAppDispatch();

    const toppingsTotal = item.toppings.reduce(
        (sum, t) => sum + t.price,
        0
    );
    const itemUnitTotal = item.base.price + toppingsTotal;
    const itemTotal = itemUnitTotal * item.quantity;

    return (
        <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-4 last:border-b-0">
            {/* Product Image */}
            {item.productImg && (
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                    <Image
                        src={item.productImg}
                        alt={item.productName}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {/* Product Details and Controls */}
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                {/* Name, Base, Toppings */}
                <div className="flex-1">
                    <h3 className="text-base font-semibold">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground">
                        Size: {item.base.name} {/*({formatPrice(item.base.price)})*/}
                    </p>
                    {item.toppings.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {item.toppings.map((t) => (
                                <span
                                    key={t.id}
                                    className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                                >
                                    {t.name} {/*(+{formatPrice(t.price)})*/}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quantity Controls and Remove Button */}
                <div className="flex items-center gap-2 justify-end sm:justify-center flex-shrink-0">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => dispatch(decrementProductQuantity(item.key!))}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => dispatch(incrementProductQuantity(item.key!))}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive ml-2"
                                onClick={() => dispatch(removeFromCart(index))}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove item</TooltipContent>
                    </Tooltip>
                </div>

                {/* Item Total Price */}
                <div className="text-right text-sm sm:w-24 flex-shrink-0">
                    <div className="font-semibold">₹{formatPrice(itemTotal)}</div>
                    <div className="text-xs text-muted-foreground">₹{formatPrice(itemUnitTotal)} each</div>
                </div>
            </div>
        </li>
    );
}