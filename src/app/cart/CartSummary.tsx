"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface CartSummaryProps {
    itemsTotal: number;
    delivery: number;
    tax: number;
    grandTotal: number;
}

export function CartSummary({ itemsTotal, delivery, tax, grandTotal }: CartSummaryProps) {
    return (
        <Card className="w-full lg:max-w-sm self-start">
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order before checkout.</CardDescription>
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
                <Button className="w-full">
                    <Link href="/checkout">Proceed to checkout</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                    <Link href="/">Continue shopping</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}