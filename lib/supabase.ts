// Supabase configuration - Now using mock data instead
// This file provides mock Supabase client for compatibility

// Mock Supabase client
const createMockSupabaseClient = () => {
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: null, error: null }),
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
          order: (column: string, options?: any) => ({
            limit: (limit: number) => Promise.resolve({ data: [], error: null }),
            range: (start: number, end: number) => Promise.resolve({ data: [], error: null, count: 0 })
          }),
          limit: (limit: number) => Promise.resolve({ data: [], error: null }),
          eq: (column2: string, value2: any) => ({
            single: () => Promise.resolve({ data: null, error: null })
          })
        }),
        order: (column: string, options?: any) => ({
          limit: (limit: number) => Promise.resolve({ data: [], error: null }),
          range: (start: number, end: number) => Promise.resolve({ data: [], error: null, count: 0 }),
          eq: (column: string, value: any) => ({
            limit: (limit: number) => Promise.resolve({ data: [], error: null }),
            single: () => Promise.resolve({ data: null, error: null })
          })
        }),
        limit: (limit: number) => Promise.resolve({ data: [], error: null }),
        range: (start: number, end: number) => Promise.resolve({ data: [], error: null, count: 0 })
      }),
      insert: (data: any) => ({
        select: (columns?: string) => ({
          single: () => Promise.resolve({ data: data, error: null })
        }),
        single: () => Promise.resolve({ data: data, error: null })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: (columns?: string) => ({
            single: () => Promise.resolve({ data: data, error: null })
          }),
          single: () => Promise.resolve({ data: data, error: null })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ error: null })
      })
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: { user: { id: 'mock-user' } } }, error: null })
    },
    channel: (name: string) => ({
      on: (event: string, options: any, callback: any) => ({
        subscribe: () => {}
      })
    }),
    removeChannel: (channel: any) => {}
  }
}

// Client-side Supabase client (browser) - MOCK
export const supabase = createMockSupabaseClient()

// Server-side Supabase client with service role (for admin operations) - MOCK
export const getServiceRoleClient = () => createMockSupabaseClient()

