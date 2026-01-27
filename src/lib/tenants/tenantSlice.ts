import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';

export interface Tenant {
    id: string;
    name: string;
}

interface TenantState {
    tenants: Tenant[];
    currentTenantId?: string;
}

const initialState: TenantState = {
    tenants: [],
    currentTenantId: undefined,
};

const tenantSlice = createSlice({
    name: 'tenants',
    initialState,
    reducers: {
        setTenants(state, action: PayloadAction<Tenant[]>) {
            state.tenants = action.payload;
        },
        setCurrentTenant(state, action: PayloadAction<string | undefined>) {
            state.currentTenantId = action.payload;
        },
    },
});

export const { setTenants, setCurrentTenant } = tenantSlice.actions;
export default tenantSlice.reducer;

// Selectors
export const selectTenants = (state: RootState) => state.tenants.tenants;
export const selectTenantById = createSelector(
    [selectTenants, (_: RootState, tenantId: string) => tenantId],
    (tenants, tenantId) => tenants.find(t => t.id === tenantId)
);
