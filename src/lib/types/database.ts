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
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    avatar_url: string | null
                    credits: number
                    tier: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    credits?: number
                    tier?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    credits?: number
                    tier?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            leads: {
                Row: {
                    id: string
                    user_id: string
                    linkedin_url: string
                    status: 'new' | 'enriching' | 'enriched' | 'error'
                    enrichment_data: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    linkedin_url: string
                    status?: 'new' | 'enriching' | 'enriched' | 'error'
                    enrichment_data?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    linkedin_url?: string
                    status?: 'new' | 'enriching' | 'enriched' | 'error'
                    enrichment_data?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            campaigns: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    status: 'draft' | 'active' | 'paused' | 'completed'
                    config: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    status?: 'draft' | 'active' | 'paused' | 'completed'
                    config?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    status?: 'draft' | 'active' | 'paused' | 'completed'
                    config?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            emails: {
                Row: {
                    id: string
                    user_id: string
                    lead_id: string
                    campaign_id: string | null
                    status: 'draft' | 'scheduled' | 'sent' | 'failed'
                    subject: string | null
                    body: string | null
                    sent_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    lead_id: string
                    campaign_id?: string | null
                    status?: 'draft' | 'scheduled' | 'sent' | 'failed'
                    subject?: string | null
                    body?: string | null
                    sent_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    lead_id?: string
                    campaign_id?: string | null
                    status?: 'draft' | 'scheduled' | 'sent' | 'failed'
                    subject?: string | null
                    body?: string | null
                    sent_at?: string | null
                    created_at?: string
                }
            }
        }
    }
}
