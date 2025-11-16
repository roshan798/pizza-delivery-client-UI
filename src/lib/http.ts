export function toQueryString(params: Record<string, string | number | boolean | undefined>): string {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') return;
        qs.append(k, String(v));
    });
    return qs.toString();
}
