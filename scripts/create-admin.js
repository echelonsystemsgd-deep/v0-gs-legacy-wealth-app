import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uwdmmjzcieunybuvnrib.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3ZG1tanpjaWV1bnlidXZucmliIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIxODQ1NCwiZXhwIjoyMDk1Nzk0NDU0fQ.1fJdwXez-Jsh7SwT6Bi3E12E8t6OeqJrKJEspq3Stk4';

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const firstName = process.argv[4] || 'Admin';
  const lastName = process.argv[5] || 'User';

  if (!email || !password) {
    console.error("Usage: node scripts/create-admin.js <email> <password> [firstName] [lastName]");
    process.exit(1);
  }

  console.log(`Creating auth user: ${email}...`);

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: firstName,
      last_name: lastName
    }
  });

  if (authError) {
    console.error("Error creating auth user:", authError.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`Auth user created successfully! ID: ${userId}`);
  console.log(`Promoting user ${email} to admin role...`);

  // Wait for the trigger handle_new_user to finish inserting into profiles
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userId)
    .select();

  if (profileError) {
    console.error("Error promoting user in profiles:", profileError.message);
    process.exit(1);
  }

  console.log("Success! Profile updated:", profileData);
  console.log(`Admin user ${email} is fully registered and promoted to admin role.`);
}

main().catch(console.error);
