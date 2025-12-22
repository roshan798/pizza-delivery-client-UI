"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { clearCart, decrementProductQuantity, incrementProductQuantity, removeFromCart, setCart } from "@/lib/cart/cartSlices";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { formatPrice } from "@/lib/utils";


import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadState } from "@/lib/cart/cartSlices"; // Import loadState from cartSlices
import { Separator } from "@radix-ui/react-select";

const CartPage = () => {
    const cart = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch();
    const [isLoadedFromLocalStorage, setIsLoadedFromLocalStorage] = useState(false);

    useEffect(() => {
        // This effect runs only on the client side after hydration
        const storedCart = loadState();
        if (storedCart.length > 0) {
            dispatch(setCart(storedCart));
        }
        setIsLoadedFromLocalStorage(true);
    }, [dispatch]);

    // Show loading state until cart data is loaded from localStorage
    if (!isLoadedFromLocalStorage) {
        return (
            <div className="min-h-[60vh] grid place-items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-primary animate-spin" />
                    <p className="text-sm text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
    }

    const itemsTotal = cart.reduce(
        (sum, item) =>
            sum +
            (item.base.price +
                item.toppings.reduce((s, t) => s + t.price, 0)) *
            item.quantity,
        0
    );

    const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const delivery = cart.length ? 40 : 0; // example
    const tax = Math.round(itemsTotal * 0.05); // example 5%
    const grandTotal = itemsTotal + delivery + tax;

    if (!cart.length) {
        return (
            <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                </div>
                <h1 className="text-xl font-semibold">Your cart is empty</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Add some items to your cart to see them here.
                </p>
                <Button className="mt-4" asChild>
                    <Link href="/">Continue shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row">
            {/* Left: items */}
            <Card className="flex-1">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Shopping Cart</CardTitle>
                        <CardDescription>
                            {itemsCount} item{itemsCount > 1 && "s"} in your cart
                        </CardDescription>
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                Clear cart
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Clear cart?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will remove all items from your cart. You cannot undo
                                    this action.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => dispatch(clearCart())}
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    Clear
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardHeader>

                <Separator className="my-4" />

                <CardContent className="p-0">
                    <ScrollArea className=" px-4 py-2">
                        <ul className="space-y-4">
                            {cart.map((item, index) => {
                                const toppingsTotal = item.toppings.reduce(
                                    (sum, t) => sum + t.price,
                                    0
                                );
                                const itemUnitTotal = item.base.price + toppingsTotal;
                                const itemTotal = itemUnitTotal * item.quantity;

                                return (
                                    <li
                                        key={index}
                                        className="flex items-start justify-between gap-4 border-b pb-4 last:border-b-0"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="text-sm font-semibold">
                                                        {item.key} -
                                                        {item.base.name}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        Base: ₹{formatPrice(item.base.price)}
                                                    </p>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    onClick={() => dispatch(removeFromCart(index))}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {item.toppings.length > 0 && (
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    <span className="font-medium">Toppings:</span>{" "}
                                                    {item.toppings
                                                        .map(
                                                            (t) => `${t.name} (+₹${formatPrice(t.price)})`
                                                        )
                                                        .join(", ")}
                                                </div>
                                            )}

                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() =>
                                                            dispatch(
                                                                decrementProductQuantity(item.key!)
                                                            )
                                                        }
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
                                                        onClick={() =>
                                                            dispatch(
                                                                incrementProductQuantity(item.key!)
                                                            )
                                                        }
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                <div className="text-right text-sm">
                                                    <div className="font-semibold">
                                                        ₹{formatPrice(itemTotal)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        ₹{formatPrice(itemUnitTotal)} each
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Right: summary */}
            <Card className="w-full max-w-sm self-start">
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
                    <Button className="w-full">Proceed to checkout</Button>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/">Continue shopping</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CartPage;
