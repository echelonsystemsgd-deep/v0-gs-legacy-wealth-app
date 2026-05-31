import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Auth Header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Verify caller is an admin
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token)
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication credentials' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('role, is_suspended')
      .eq('id', user.id)
      .single()

    if (profileErr || !profile || profile.role !== 'admin' || profile.is_suspended) {
      return new Response(JSON.stringify({ error: 'Unauthorized. Admins only.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Parse payload
    const { target_user_id, action } = await req.json()
    if (!target_user_id || !action) {
      return new Response(JSON.stringify({ error: 'Missing target_user_id or action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (target_user_id === user.id) {
      return new Response(JSON.stringify({ error: 'You cannot perform actions on your own account.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'delete') {
      // Delete user from auth schema
      const { error: deleteErr } = await supabase.auth.admin.deleteUser(target_user_id)
      if (deleteErr) throw deleteErr

      // Log action
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action_type: 'DELETE_USER',
        target_table: 'profiles',
        target_id: target_user_id,
        details: { target: target_user_id }
      })

    } else if (action === 'suspend') {
      // Suspend profile
      const { error: suspendErr } = await supabase
        .from('profiles')
        .update({ is_suspended: true })
        .eq('id', target_user_id)

      if (suspendErr) throw suspendErr

      // Log action
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action_type: 'SUSPEND_USER',
        target_table: 'profiles',
        target_id: target_user_id,
        details: { status: 'suspended' }
      })

    } else if (action === 'unsuspend') {
      // Reactivate profile
      const { error: unsuspendErr } = await supabase
        .from('profiles')
        .update({ is_suspended: false })
        .eq('id', target_user_id)

      if (unsuspendErr) throw unsuspendErr

      // Log action
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action_type: 'REACTIVATE_USER',
        target_table: 'profiles',
        target_id: target_user_id,
        details: { status: 'active' }
      })
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported action value' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
