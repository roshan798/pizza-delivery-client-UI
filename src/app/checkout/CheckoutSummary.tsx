"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CheckoutSummaryProps = {
    itemsTotal: number;
    delivery: number;
    tax: number;
    discount: number;
    grandTotal: number;
    onPlaceOrder: () => void;
};

export function CheckoutSummary(props: CheckoutSummaryProps) {
    // Props are now directly passed from CheckoutPage
    const { itemsTotal, delivery, tax, discount, grandTotal, onPlaceOrder } = props;

    return (
        <Card className="w-full lg:max-w-sm self-start">
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order before placing it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Items total</span>
                    <span className="font-medium">
                        ₹{formatPrice(itemsTotal)}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium">
                        {delivery ? `₹${formatPrice(delivery)}` : "Free"}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-green-600">
                        - ₹{formatPrice(discount)}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax (5%)</span>
                    <span className="font-medium">
                        ₹{formatPrice(tax)}
                    </span>
                </div>


                <Separator className="my-4" />

                <div className="flex items-center justify-between text-base">
                    <span className="font-semibold">Total to pay</span>
                    <span className="text-lg font-bold">
                        ₹{formatPrice(grandTotal)}
                    </span>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" onClick={onPlaceOrder}>Place Order</Button>
            </CardFooter>
        </Card>
    );
}