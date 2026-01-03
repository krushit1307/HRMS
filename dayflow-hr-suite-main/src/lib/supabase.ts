import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (auto-generated from your schema)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'hr' | 'employee'
          avatar_url: string | null
          employee_id: string
          department: string
          position: string
          join_date: string
          phone: string | null
          address: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'admin' | 'hr' | 'employee'
          avatar_url?: string | null
          employee_id: string
          department?: string
          position?: string
          join_date?: string
          phone?: string | null
          address?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'hr' | 'employee'
          avatar_url?: string | null
          employee_id?: string
          department?: string
          position?: string
          join_date?: string
          phone?: string | null
          address?: string | null
          is_active?: boolean
        }
      }
      attendance: {
        Row: {
          id: string
          user_id: string
          date: string
          check_in: string | null
          check_out: string | null
          status: 'present' | 'late' | 'absent' | 'half-day' | 'leave'
          work_hours: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
      }
      leave_requests: {
        Row: {
          id: string
          user_id: string
          type: 'paid' | 'sick' | 'unpaid'
          start_date: string
          end_date: string
          days: number
          status: 'pending' | 'approved' | 'rejected'
          reason: string
          approved_by: string | null
          approved_at: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
      }
      leave_balances: {
        Row: {
          id: string
          user_id: string
          year: number
          paid_leave_total: number
          paid_leave_used: number
          sick_leave_total: number
          sick_leave_used: number
          created_at: string
          updated_at: string
        }
      }
      payroll: {
        Row: {
          id: string
          user_id: string
          month: string
          year: number
          basic_salary: number
          allowances: number
          deductions: number
          net_salary: number
          status: 'pending' | 'paid'
          payment_date: string | null
          payment_method: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
