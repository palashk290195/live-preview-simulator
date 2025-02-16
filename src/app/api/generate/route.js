// src/app/api/generate/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

let supabase;
try {
  // Use server-side environment variables
  supabase = createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
} catch (error) {
  console.error('Supabase client initialization error:', error);
}

export async function POST(request) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const config = await request.json();
    console.log('Attempting to save config:', config);

    // Now try to save the data to the 'base' table
    const { data, error } = await supabase
      .from('base')
      .upsert({
        id: 1,
        name: config.name,
        asset: config.asset || null
      })
      .select();

    if (error) {
      console.error('Supabase save error:', error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process configuration' },
      { status: 500 }
    );
  }
}