import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function testInsert() {
    // We need a valid user ID to satisfy RLS. Let's get the first user ID we can find.
    // Or we bypass RLS for testing by using the service role key if we had it.
    // Since we don't, let's try to authenticate or just insert and look at the error.

    // First, let's auth as the user we created earlier
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'testuser99@example.com',
        password: 'Password123!'
    })

    if (authError || !authData.user) {
        console.error("Auth failed:", authError)
        return
    }

    const userId = authData.user.id
    console.log("Authenticated as:", userId)

    const testLead = {
        user_id: userId,
        linkedin_url: "https://www.linkedin.com/in/duesman/",
        email: "sduesman@gmail.com",
        enrichment_data: {
            first_name: "Seth",
            last_name: "Duesman",
            company: "VELOX",
            title: "Partner Manager"
        },
        status: 'pending'
    }

    const { data, error } = await supabase.from('leads').insert([testLead]).select()

    if (error) {
        console.error("❌ Insert Error:", error)
    } else {
        console.log("✅ Insert Success:", data)
    }
}

testInsert()
