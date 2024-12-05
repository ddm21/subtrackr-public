export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          name: string
          amount: number
          currency: string
          type: string
          website_url?: string
          start_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          amount: number
          currency: string
          type: string
          website_url?: string
          start_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          amount?: number
          currency?: string
          type?: string
          website_url?: string
          start_date?: string
          created_at?: string
        }
      }
    }
  }
}