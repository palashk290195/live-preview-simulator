// app/page.js
import { supabase } from '../lib/supabaseClient';
import ClientComponent from './ClientComponent';

export default async function Page() {
  // Fetch the config from Supabase 'base' table
  let { data: config, error } = await supabase
    .from('base')
    .select('*')
    .eq('id', 1)  // Get the record with id 1
    .single(); 

  if (error) {
    console.log('Error fetching config:', error);
    // Provide default values if no data exists
    config = { 
      id: 1,
      name: 'DefaultName', 
      asset: '' 
    }; 
  }

  return (
    <div>
      <h1>Live Preview with Supabase</h1>
      <ClientComponent initialConfig={config} />
    </div>
  );
}