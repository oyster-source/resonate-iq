
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    const fullName = formData.get('fullName') as string
    if (!fullName) return { error: 'Name is required' }

    const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
    })

    if (error) {
        console.error('Error updating profile:', error)
        return { error: 'Failed to update profile' }
    }

    revalidatePath('/dashboard/settings')
    return { success: true }
}
