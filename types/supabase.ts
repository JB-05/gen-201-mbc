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
            teams: {
                Row: {
                    id: string
                    team_name: string
                    school_name: string
                    school_district: string
                    lead_phone: string
                    lead_email: string
                    registration_status: 'pending' | 'shortlisted' | 'rejected' | 'verified'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    team_name: string
                    school_name: string
                    school_district: string
                    lead_phone: string
                    lead_email: string
                    registration_status?: 'pending' | 'shortlisted' | 'rejected' | 'verified'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    team_name?: string
                    school_name?: string
                    school_district?: string
                    lead_phone?: string
                    lead_email?: string
                    registration_status?: 'pending' | 'shortlisted' | 'rejected' | 'verified'
                    created_at?: string
                    updated_at?: string
                }
            }
            team_members: {
                Row: {
                    id: string
                    team_id: string
                    name: string
                    gender: 'male' | 'female' | 'other'
                    grade: '11' | '12'
                    phone: string
                    email: string
                    food_preference: 'veg' | 'non_veg' | 'none'
                    is_team_lead: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    team_id: string
                    name: string
                    gender: 'male' | 'female' | 'other'
                    grade: '11' | '12'
                    phone: string
                    email: string
                    food_preference?: 'veg' | 'non_veg' | 'none'
                    is_team_lead?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    team_id?: string
                    name?: string
                    gender?: 'male' | 'female' | 'other'
                    grade?: '11' | '12'
                    phone?: string
                    email?: string
                    food_preference?: 'veg' | 'non_veg' | 'none'
                    is_team_lead?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}

