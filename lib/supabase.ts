// Temporary mock Supabase client for UI development
export const supabase = {
    from: () => ({
        insert: async () => ({ data: { id: 'mock-id' }, error: null }),
        select: async () => ({ data: null, error: null }),
        single: async () => ({ data: null, error: null }),
    }),
};
