import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Create regular client for user verification
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify the requesting user is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if there are any admins in the system
    const { data: existingAdmins, error: adminCheckError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (adminCheckError) {
      console.error('Error checking for existing admins:', adminCheckError);
      return new Response(
        JSON.stringify({ error: 'Error interno del servidor' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no admins exist, allow creating the first admin user
    const noAdminsExist = !existingAdmins || existingAdmins.length === 0;
    
    if (!noAdminsExist) {
      // Check if current user has admin role
      const { data: userRoles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin');

      if (roleError || !userRoles || userRoles.length === 0) {
        console.error('Not admin:', roleError);
        return new Response(
          JSON.stringify({ error: 'Se requieren permisos de administrador' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      console.log('No admins exist, allowing creation of first admin user');
    }

    const body = await req.json();
    const { email, password, full_name, phone, address, city, notes, roles } = body;

    console.log('Creating user:', { email, full_name, roles });

    // Create user with admin client
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name
      }
    });

    if (createError) {
      console.error('Error creating user:', createError);
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User created:', newUser.user.id);

    // Create user profile
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        user_id: newUser.user.id,
        full_name,
        phone: phone || null,
        address: address || null,
        city: city || null,
        notes: notes || null,
        is_active: true
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Try to clean up the created user
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      return new Response(
        JSON.stringify({ error: 'Error al crear el perfil del usuario' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create user roles
    if (roles && roles.length > 0) {
      const roleData = roles.map((role: string) => ({
        user_id: newUser.user.id,
        role,
        created_by: user.id
      }));

      const { error: rolesError } = await supabaseAdmin
        .from('user_roles')
        .insert(roleData);

      if (rolesError) {
        console.error('Error creating roles:', rolesError);
        // Try to clean up
        await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
        return new Response(
          JSON.stringify({ error: 'Error al asignar roles al usuario' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('User creation completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        user_id: newUser.user.id,
        message: 'Usuario creado exitosamente'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});