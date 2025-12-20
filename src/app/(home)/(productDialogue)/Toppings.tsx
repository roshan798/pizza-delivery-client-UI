import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { Topping } from "@/types/types";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Toppings({
    url,
    addons,
    setAddons,
}: {
    url: string;
    addons: (Topping & { checked: boolean })[];
    setAddons: React.Dispatch<
        React.SetStateAction<
            (Topping & {
                checked: boolean;
            })[]
        >
    >;
}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Fetch toppings on mount or URL change
    useEffect(() => {
        async function fetchToppings() {
            try {
                const response = await fetch(url);
                const json = await response.json();
                if (json.success && Array.isArray(json.data)) {
                    setAddons(
                        (json.data as Topping[]).map((t) => ({
                            checked: false,
                            ...t,
                        }))
                    );
                } else {
                    setError('Invalid response data');
                }
            } catch {
                setError('Failed to fetch toppings');
            } finally {
                setLoading(false);
            }
        }
        fetchToppings();
    }, [url, setAddons]);

    if (loading) return <div>Loading toppings...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    const handleOnCheckChange = (id: string) => {
        setAddons((prev) => {
            return prev.map((t) =>
                t.id === id ? { ...t, checked: !t.checked } : t
            );
        });
    };
    return (
        <div className="space-y-3">
            <p className="text-sm font-medium">Extra toppings</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 auto-rows-fr">
                {addons.map((t) => {
                    const checked = t.checked;
                    return (
                        <Label
                            key={t.id}
                            htmlFor={`addon-${t.id}`}
                            className={clsx(
                                'rounded-lg border p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50 min-h-[9.5rem]',
                                checked &&
                                'border-primary ring-1 ring-primary/30'
                            )}
                        >
                            <div className="relative w-30 h-20 rounded-md overflow-hidden bg-gray-100">
                                <Image
                                    src={t.image}
                                    alt={t.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-xs text-gray-600 text-center line-clamp-1">
                                {t.name}
                            </span>
                            <span className="text-sm font-medium">
                                {formatPrice(t.price)}
                            </span>
                            <Checkbox
                                id={`addon-${t.id}`}
                                checked={checked}
                                onCheckedChange={() =>
                                    handleOnCheckChange(t.id)
                                }
                                className="sr-only"
                            />
                        </Label>
                    );
                })}
            </div>
        </div>
    );
}