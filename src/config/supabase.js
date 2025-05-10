// Supabase configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Use service role key to bypass RLS
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// Initialize with detailed logging for debugging
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
  },
  global: {
    fetch: (...args) => {
      console.log('Supabase API Request:', args[0]);
      return fetch(...args);
    }
  }
});

export default supabase;


