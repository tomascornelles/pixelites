import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabase = createClient('https://bmxrawemtlhhkagpapis.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJteHJhd2VtdGxoaGthZ3BhcGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM0NTIzMzYsImV4cCI6MjAzOTAyODMzNn0.vcbz6eIi3hmXpw8G9s0PVaYfI6IeZigxfNdmjwSvaXs');

const auth = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: 'menos5@gmail.com',
    password: 'mayhem55',
  })
}

export {
  supabase,
};
