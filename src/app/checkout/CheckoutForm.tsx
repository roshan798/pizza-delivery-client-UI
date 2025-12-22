"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

type FormData = {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    paymentMethod: string;
    couponCode: string;
}
interface CheckoutFormProps {
    onFormChange: (data: FormData) => void;
}

const dummyAddresses = [
    { id: "addr1", name: "Home", address: "123 Main St", city: "New York", zip: "10001" },
    { id: "addr2", name: "Work", address: "456 Office Ave", city: "New York", zip: "10002" },
];

const NEW_ADDRESS_ID = "newAddress";

const initialSelectedAddress = dummyAddresses[0];
const initialFormData: FormData = {
    fullName: "",
    email: "",
    phone: "",
    address: initialSelectedAddress?.address || "",
    city: initialSelectedAddress?.city || "",
    zip: initialSelectedAddress?.zip || "",
    paymentMethod: "cashOnDelivery",
    couponCode: "",
};

export function CheckoutForm({ onFormChange }: CheckoutFormProps) {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [selectedAddressId, setSelectedAddressId] = useState<string>(initialSelectedAddress?.id || NEW_ADDRESS_ID);

    useEffect(() => {
        onFormChange(formData); // Notify parent of changes
    }, [formData, onFormChange]); // Only depend on formData and onFormChange

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }));
    };

    const handleAddressSelection = (value: string) => {
        setSelectedAddressId(value);
        if (value === NEW_ADDRESS_ID) {
            setFormData(prev => ({
                ...prev,
                address: "",
                city: "",
                zip: "",
            }));
        } else {
            const selected = dummyAddresses.find(addr => addr.id === value);
            if (selected) {
                setFormData(prev => ({
                    ...prev,
                    address: selected.address,
                    city: selected.city,
                    zip: selected.zip,
                }));
            }
        }
    };
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Shipping & Payment</CardTitle>
                <CardDescription>Enter your details to complete the order.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1234567890" value={formData.phone} onChange={handleChange} required />
                    </div>

                    {/* Address Selection */}
                    <div className="space-y-2">
                        <Label>Shipping Address</Label>
                        <RadioGroup
                            value={selectedAddressId}
                            onValueChange={handleAddressSelection}
                            className="grid grid-cols-1 gap-2"
                        >
                            {dummyAddresses.map((addr) => (
                                <Label
                                    key={addr.id}
                                    htmlFor={addr.id}
                                    className={cn(
                                        "flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-gray-50",
                                        selectedAddressId === addr.id ? "border-primary" : "border-gray-300"
                                    )}
                                >
                                    <RadioGroupItem id={addr.id} value={addr.id} className="self-center" />
                                    <div className="flex flex-col justify-center flex-grow gap-1 ml-2">
                                        <span className="font-medium">{addr.name}</span>
                                        <span className="text-sm text-muted-foreground">{addr.address}, {addr.city} - {addr.zip}</span>
                                    </div>
                                </Label>
                            ))}
                            <Label
                                htmlFor={NEW_ADDRESS_ID}
                                className={cn(
                                    "flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-gray-50",
                                    selectedAddressId === NEW_ADDRESS_ID ? "border-primary" : "border-gray-300"
                                )}
                            >
                                <RadioGroupItem id={NEW_ADDRESS_ID} value={NEW_ADDRESS_ID} className="self-center" />
                                <span className="flex-grow ml-2 font-medium">+ Add new address</span>
                            </Label>
                        </RadioGroup>
                    </div>

                    {selectedAddressId === NEW_ADDRESS_ID && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="address">New Shipping Address</Label>
                                <Textarea id="address" placeholder="123 Main St" value={formData.address} onChange={handleChange} required={selectedAddressId === NEW_ADDRESS_ID} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" placeholder="New York" value={formData.city} onChange={handleChange} required={selectedAddressId === NEW_ADDRESS_ID} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip">Zip Code</Label>
                                    <Input id="zip" placeholder="10001" value={formData.zip} onChange={handleChange} required={selectedAddressId === NEW_ADDRESS_ID} />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Coupon Code */}
                    <div className="space-y-2">
                        <Label htmlFor="couponCode">Coupon Code</Label>
                        <div className="flex gap-2">
                            <Input id="couponCode" placeholder="Enter coupon code" value={formData.couponCode} onChange={handleChange} disabled />
                            <Button type="button" disabled>Apply</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <input type="radio" id="cashOnDelivery" name="paymentMethod" value="cashOnDelivery" checked={formData.paymentMethod === "cashOnDelivery"} onChange={handlePaymentChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                                <Label htmlFor="cashOnDelivery">Cash on Delivery</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="radio" id="cardPayment" name="paymentMethod" value="cardPayment" checked={formData.paymentMethod === "cardPayment"} onChange={handlePaymentChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" disabled />
                                <Label htmlFor="cardPayment" className={formData.paymentMethod === "cardPayment" ? "" : "text-gray-400"}>Card Payment (Coming Soon)</Label>
                            </div>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}