import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function runTest() {
    console.log("🚀 Starting Campaign Engine Test...")

    // 1. Create and Authenticate as the test user
    console.log("1. Creating test user...")
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `test_engine_user_${Date.now()}@test.com`,
        password: 'Password123!'
    })

    if (authError || !authData.user || !authData.session) {
        console.error("❌ Signup failed.", authError)
        return
    }
    const userId = authData.user.id
    console.log(`✅ Authenticated user: ${userId}`)

    // 2. Create a Lead
    console.log("2. Creating a test lead...")
    const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert({
            user_id: userId,
            email: 'test_lead_recipient@example.com', // Change to a real email if you want to receive it
            enrichment_data: {
                first_name: 'John',
                last_name: 'Tester',
                company: 'Acme Corp',
                title: 'CEO'
            },
            status: 'pending'
        })
        .select()
        .single()

    if (leadError) {
        console.error("❌ Failed to create lead", leadError)
        return
    }
    console.log(`✅ Created lead: ${leadData.id}`)

    // 3. Create a Campaign
    console.log("3. Creating a test campaign...")
    const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
            user_id: userId,
            name: "Engine Test Campaign",
            description: "Testing AI Copywriting and Drip Logic",
            status: "active" // Must be active for engine to pick it up
        })
        .select()
        .single()

    if (campaignError) {
        console.error("❌ Failed to create campaign", campaignError)
        return
    }
    console.log(`✅ Created campaign: ${campaignData.id}`)

    // 4. Create a Campaign Step
    console.log("4. Creating campaign step...")
    const { data: stepData, error: stepError } = await supabase
        .from('campaign_steps')
        .insert({
            campaign_id: campaignData.id,
            user_id: userId,
            type: 'email',
            order_index: 0,
            delay_days: 1
        })
        .select()
        .single()

    if (stepError) {
        console.error("❌ Failed to create step", stepError)
        return
    }

    // 5. Create Email Variant
    console.log("5. Creating email variant...")
    const { error: variantError } = await supabase
        .from('email_variants')
        .insert({
            step_id: stepData.id,
            user_id: userId,
            name: 'Variant A',
            subject: 'Quick question for {{company}}',
            body: 'Hi {{firstName}},\n\nI saw you are the {{title}} at {{company}}. I have a quick question about your workflow.\n\nBest,\nTest User'
        })

    if (variantError) {
        console.error("❌ Failed to create variant", variantError)
        return
    }

    // 6. Add Lead to Campaign
    console.log("6. Enrolling lead into campaign...")
    // Make sure next_step_at is "now" or less so the engine picks it up immediately
    const { error: enrollError } = await supabase
        .from('campaign_leads')
        .insert({
            campaign_id: campaignData.id,
            lead_id: leadData.id,
            status: 'active',
            next_step_at: new Date().toISOString()
        })

    if (enrollError) {
        console.error("❌ Failed to enroll lead", enrollError)
        return
    }

    // 7. Trigger the Engine via local API
    console.log("7. Triggering local engine API endpoint...")
    try {
        const response = await fetch('http://localhost:3000/api/campaigns/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Need to pass the user's session token to pass the auth check in the route
                'Cookie': `sb-bkuzcjaeiktnhvbokhhj-auth-token=${JSON.stringify([
                    authData.session.access_token,
                    authData.session.refresh_token,
                    null, null, null
                ])}`
            },
            body: JSON.stringify({ campaignId: campaignData.id })
        })

        const result = await response.json()
        console.log("✅ Engine API Response:", result)
    } catch (apiError) {
        console.error("❌ Failed to call engine API", apiError)
    }

    console.log("🎉 Test Setup Complete!")
}

runTest()
