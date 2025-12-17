
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ProductFinderState, ProductResultData, ProcurementAgent, VerificationResult } from '../../types';

const initialState: ProductFinderState = {
  results: [],
  agents: [],
  loading: false,
  agentsLoading: false,
  error: null,
};

const productFinderSlice = createSlice({
  name: 'productFinder',
  initialState,
  reducers: {
    findProductsStart(state, action: PayloadAction<{ query: string; imageBase64: string | null }>) {
      state.loading = true;
      state.error = null;
      state.results = [];
    },
    findProductsSuccess(state, action: PayloadAction<ProductResultData[]>) {
      state.loading = false;
      state.results = action.payload;
    },
    findProductsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchMoreProductsStart(state, action: PayloadAction<{ query: string }>) {
        state.loading = true;
        state.error = null;
    },
    fetchMoreProductsSuccess(state, action: PayloadAction<ProductResultData[]>) {
        state.loading = false;
        state.results = [...state.results, ...action.payload];
    },
    fetchMoreProductsFailure(state, action: PayloadAction<string>) {
        state.loading = false;
        state.error = action.payload;
    },
    setProductResults(state, action: PayloadAction<ProductResultData[]>) {
        state.results = action.payload;
    },
    // Procurement Agents
    fetchAgentsStart(state, action: PayloadAction<{ userCountry: string }>) {
        state.agentsLoading = true;
        state.error = null;
        state.agents = [];
    },
    fetchAgentsSuccess(state, action: PayloadAction<ProcurementAgent[]>) {
        state.agentsLoading = false;
        state.agents = action.payload;
    },
    fetchAgentsFailure(state, action: PayloadAction<string>) {
        state.agentsLoading = false;
        state.error = action.payload;
    },
    // Verification - Seller
    verifySellerStart(state, action: PayloadAction<{ productId: string; sellerName: string; url: string; platform: string }>) {
        const product = state.results.find(p => p.id === action.payload.productId);
        if (product && product.sellerInfo) {
            product.sellerInfo.isVerifying = true;
        }
    },
    verifySellerSuccess(state, action: PayloadAction<{ productId: string; verification: VerificationResult }>) {
        const product = state.results.find(p => p.id === action.payload.productId);
        if (product && product.sellerInfo) {
            product.sellerInfo.isVerifying = false;
            product.sellerInfo.verification = action.payload.verification;
            // Update base details if found
            if(action.payload.verification.address) product.sellerInfo.address = action.payload.verification.address;
            if(action.payload.verification.phone) product.sellerInfo.phone = action.payload.verification.phone;
            if(action.payload.verification.email) product.sellerInfo.email = action.payload.verification.email;
        }
    },
    verifySellerFailure(state, action: PayloadAction<{ productId: string; error: string }>) {
        const product = state.results.find(p => p.id === action.payload.productId);
        if (product && product.sellerInfo) {
            product.sellerInfo.isVerifying = false;
        }
        state.error = action.payload.error;
    },
    // Verification - Agent
    verifyAgentStart(state, action: PayloadAction<{ agentId: string; name: string; url: string }>) {
        const agent = state.agents.find(a => a.id === action.payload.agentId);
        if (agent) {
            agent.isVerifying = true;
        }
    },
    verifyAgentSuccess(state, action: PayloadAction<{ agentId: string; verification: VerificationResult }>) {
        const agent = state.agents.find(a => a.id === action.payload.agentId);
        if (agent) {
            agent.isVerifying = false;
            agent.verification = action.payload.verification;
        }
    },
    verifyAgentFailure(state, action: PayloadAction<{ agentId: string; error: string }>) {
        const agent = state.agents.find(a => a.id === action.payload.agentId);
        if (agent) {
            agent.isVerifying = false;
        }
        state.error = action.payload.error;
    }
  },
});

export const { 
    findProductsStart, 
    findProductsSuccess, 
    findProductsFailure,
    fetchMoreProductsStart,
    fetchMoreProductsSuccess,
    fetchMoreProductsFailure,
    setProductResults,
    fetchAgentsStart,
    fetchAgentsSuccess,
    fetchAgentsFailure,
    verifySellerStart,
    verifySellerSuccess,
    verifySellerFailure,
    verifyAgentStart,
    verifyAgentSuccess,
    verifyAgentFailure
} = productFinderSlice.actions;
export default productFinderSlice.reducer;
