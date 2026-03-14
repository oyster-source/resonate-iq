import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function check() {
    console.log("Fetching url:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL!)
        console.log("Fetch success:", res.status)
    } catch (e) {
        console.log("Fetch native error:", e)
    }

    try {
        const { data, error } = await supabase.from('campaigns').select('id').limit(1)
        console.log("Supabase client query result:", { data, error })
    } catch (e) {
        console.log("Supabase client native error", e)
    }
}
check()
