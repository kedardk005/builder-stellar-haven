// API utility functions for authenticated requests

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  auth?: boolean;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
  async request<T = any>(url: string, options: ApiOptions = {}): Promise<T> {
    const { method = "GET", headers = {}, body, auth = true } = options;

    // Set default headers
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Add authorization header if auth is required
    if (auth) {
      const token = localStorage.getItem("reWearToken");
      if (token) {
        defaultHeaders["Authorization"] = `Bearer ${token}`;
      }
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: defaultHeaders,
    };

    // Add body if provided (and not GET request)
    if (body && method !== "GET") {
      if (body instanceof FormData) {
        // Don't set Content-Type for FormData, let browser set it
        delete defaultHeaders["Content-Type"];
        requestOptions.body = body;
      } else {
        requestOptions.body = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new ApiError(
          data.message || `HTTP ${response.status} Error`,
          response.status,
          data,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Network error", 0, error);
    }
  },

  // Convenience methods
  get<T = any>(
    url: string,
    options: Omit<ApiOptions, "method"> = {},
  ): Promise<T> {
    return this.request<T>(url, { ...options, method: "GET" });
  },

  post<T = any>(
    url: string,
    body?: any,
    options: Omit<ApiOptions, "method" | "body"> = {},
  ): Promise<T> {
    return this.request<T>(url, { ...options, method: "POST", body });
  },

  put<T = any>(
    url: string,
    body?: any,
    options: Omit<ApiOptions, "method" | "body"> = {},
  ): Promise<T> {
    return this.request<T>(url, { ...options, method: "PUT", body });
  },

  patch<T = any>(
    url: string,
    body?: any,
    options: Omit<ApiOptions, "method" | "body"> = {},
  ): Promise<T> {
    return this.request<T>(url, { ...options, method: "PATCH", body });
  },

  delete<T = any>(
    url: string,
    options: Omit<ApiOptions, "method"> = {},
  ): Promise<T> {
    return this.request<T>(url, { ...options, method: "DELETE" });
  },
};

// Admin API functions
export const adminApi = {
  getStats: () => api.get("/api/admin/stats"),

  getPendingItems: (page = 1, limit = 10) =>
    api.get(`/api/admin/items/pending?page=${page}&limit=${limit}`),

  getFlaggedItems: (page = 1, limit = 10) =>
    api.get(`/api/admin/items/flagged?page=${page}&limit=${limit}`),

  getUsers: (
    params: { search?: string; page?: number; limit?: number } = {},
  ) => {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    return api.get(`/api/admin/users?${query}`);
  },

  approveItem: (itemId: string, qualityBadge?: string) =>
    api.post("/api/admin/items/approve", { itemId, qualityBadge }),

  rejectItem: (itemId: string, reason: string) =>
    api.post("/api/admin/items/reject", { itemId, reason }),

  updateQuality: (itemId: string, qualityBadge: string) =>
    api.post("/api/admin/items/quality", { itemId, qualityBadge }),

  grantPoints: (userId: string, points: number, reason: string) =>
    api.post("/api/admin/users/grant-points", { userId, points, reason }),

  moderateContent: (
    itemId: string,
    action: "remove" | "restore",
    reason?: string,
  ) => api.post("/api/admin/content/moderate", { itemId, action, reason }),
};

// Items API functions
export const itemsApi = {
  getItems: (
    params: {
      page?: number;
      limit?: number;
      category?: string;
      condition?: string;
      minPrice?: number;
      maxPrice?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: string;
      featured?: boolean;
    } = {},
  ) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    });
    return api.get(`/api/items?${query}`, { auth: false });
  },

  getItem: (id: string) => api.get(`/api/items/${id}`, { auth: false }),

  createItem: (formData: FormData) =>
    api.post("/api/items", formData, { headers: {} }), // Let browser set Content-Type for FormData

  updateItem: (id: string, data: any) => api.put(`/api/items/${id}`, data),

  deleteItem: (id: string) => api.delete(`/api/items/${id}`),

  likeItem: (id: string) => api.post(`/api/items/${id}/like`),

  flagItem: (id: string, reason: string) =>
    api.post(`/api/items/${id}/flag`, { reason }),

  getMyItems: (
    params: { page?: number; limit?: number; status?: string } = {},
  ) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        query.append(key, value.toString());
      }
    });
    return api.get(`/api/items/user/my-items?${query}`);
  },

  // Exchange methods
  requestSwap: (
    itemId: string,
    data: { message?: string; offeredItemId?: string },
  ) => api.post(`/api/items/${itemId}/swap`, data),

  redeemWithPoints: (itemId: string) => api.post(`/api/items/${itemId}/redeem`),

  purchaseWithINR: (itemId: string, data: { paymentMethod?: string }) =>
    api.post(`/api/items/${itemId}/purchase`, data),
};

// Orders API functions
export const ordersApi = {
  createOrder: (data: {
    itemId: string;
    shippingAddress: any;
    paymentMethod: "razorpay" | "points";
  }) => api.post("/api/orders", data),

  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => api.post("/api/orders/verify-payment", data),

  getMyOrders: (
    params: {
      page?: number;
      limit?: number;
      type?: "all" | "bought" | "sold";
    } = {},
  ) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        query.append(key, value.toString());
      }
    });
    return api.get(`/api/orders/my-orders?${query}`);
  },

  getOrder: (id: string) => api.get(`/api/orders/${id}`),

  cancelOrder: (id: string) => api.put(`/api/orders/${id}/cancel`),
};

// Auth API functions
export const authApi = {
  updateProfile: (data: {
    name?: string;
    email?: string;
    phone?: string;
    bio?: string;
  }) => api.put("/api/auth/profile", data),
};

export { ApiError };
