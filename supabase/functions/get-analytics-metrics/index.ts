import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📊 Analytics metrics request started');
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify admin access
    const authHeader = req.headers.get('Authorization');
    console.log('🔐 Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.error('❌ No Authorization header found');
      return new Response(JSON.stringify({ 
        error: 'Unauthorized',
        message: 'Missing Authorization header'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    console.log('🔍 Attempting to get user from token...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error getting user:', userError);
      return new Response(JSON.stringify({ 
        error: 'Unauthorized',
        message: 'Invalid or expired token',
        details: userError.message
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!user) {
      console.error('❌ No user found from token');
      return new Response(JSON.stringify({ 
        error: 'Unauthorized',
        message: 'No user found'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ User authenticated:', user.id, user.email);

    // Check admin role
    console.log('🔍 Checking admin role for user:', user.id);
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (rolesError) {
      console.error('❌ Error checking roles:', rolesError);
      return new Response(JSON.stringify({ 
        error: 'Internal Server Error',
        message: 'Error checking user roles'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('📋 User roles:', roles);

    const isAdmin = roles?.some(r => r.role === 'admin');
    if (!isAdmin) {
      console.error('❌ User is not admin:', user.email);
      return new Response(JSON.stringify({ 
        error: 'Forbidden',
        message: 'Admin access required'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Admin access verified');

    const { period } = await req.json();
    
    // Calculate time ranges
    const now = new Date();
    let startTime: Date;
    
    switch (period) {
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Fetch all events in the period
    const { data: events, error } = await supabaseAdmin
      .from('user_analytics_events')
      .select('*')
      .gte('created_at', startTime.toISOString());

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`Found ${events?.length || 0} events in period ${period}`);

    // Calculate metrics
    const metrics = {
      // Unique visitors (by session_id)
      uniqueVisitors: new Set(events?.filter(e => e.event_type === 'page_visit').map(e => e.session_id)).size,
      
      // Home page behavior
      homeExploreClicks: events?.filter(e => e.event_type === 'home_explore_click').length || 0,
      homeGenerateClicks: events?.filter(e => e.event_type === 'home_generate_click').length || 0,
      
      // Explore page behavior
      explorePeopleClicks: events?.filter(e => e.event_type === 'explore_people_click').length || 0,
      exploreCategoryClicks: events?.filter(e => e.event_type === 'explore_category_click').length || 0,
      exploreSearchClicks: events?.filter(e => e.event_type === 'explore_search_click').length || 0,
      
      // Summaries and Audio generation
      summariesGenerated: events?.filter(e => e.event_type === 'home_generate_click').length || 0,
      audioGenerated: events?.filter(e => e.event_type === 'audio_generated').length || 0,
    };

    console.log('Calculated metrics:', metrics);

    // Daily breakdown for charts (for 7d and 30d periods)
    let dailyData = null;
    if (period === '7d' || period === '30d') {
      const days = period === '7d' ? 7 : 30;
      dailyData = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const dayStart = new Date(now);
        dayStart.setDate(dayStart.getDate() - i);
        dayStart.setHours(0, 0, 0, 0);
        
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);
        
        const dayEvents = events?.filter(e => {
          const eventDate = new Date(e.created_at);
          return eventDate >= dayStart && eventDate <= dayEnd;
        }) || [];
        
        dailyData.push({
          date: dayStart.toISOString().split('T')[0],
          uniqueVisitors: new Set(dayEvents.filter(e => e.event_type === 'page_visit').map(e => e.session_id)).size,
          audioGenerated: dayEvents.filter(e => e.event_type === 'audio_generated').length,
        });
      }
    }

    return new Response(
      JSON.stringify({ metrics, dailyData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
