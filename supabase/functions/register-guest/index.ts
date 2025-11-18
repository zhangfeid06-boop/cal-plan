import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { bookingId, name, phone, attendeeCount, carPlate, company, agreedToTerms } = body;

    if (!bookingId || !name || !phone || !agreedToTerms) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate guest ID
    const guestId = `guest_${Date.now()}`;

    // Insert guest registration
    const { data: registration, error } = await supabase
      .from('guest_registrations')
      .insert({
        id: guestId,
        booking_id: bookingId,
        name,
        phone,
        attendee_count: attendeeCount ? parseInt(attendeeCount) : null,
        car_plate: carPlate || null,
        company: company || null,
        agreed_to_terms: agreedToTerms
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating guest registration:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to register guest' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Guest registered:', registration);

    return new Response(
      JSON.stringify({ guestId, registration }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error registering guest:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});