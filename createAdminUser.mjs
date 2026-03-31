import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aypetjtkekyrvwboluhj.supabase.co'
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5cGV0anRrZWt5cnZ3Ym9sdWhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDkwMTc3NywiZXhwIjoyMDkwNDc3Nzc3fQ.WZdzprMuPrjc7UcEGvD8t6vWJi2-J1cY6O3m7xL_CV4'

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@medicine.com',
    password: 'password123',
    email_confirm: true
  })
  
  if (error) {
    if (error.message.includes('already registered')) {
      console.log('Admin user already exists!')
    } else {
      console.error('Error creating user:', error.message)
    }
  } else {
    console.log('Successfully created admin user:', data.user.id)
  }
}

createUser()
