const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const fallbackUrl = 'https://placeholder.supabase.co';
let supabaseUrl = process.env.SUPABASE_URL || fallbackUrl;
if (!supabaseUrl.startsWith('http')) {
  supabaseUrl = fallbackUrl;
}

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'placeholder_key';

// Initialize the Supabase Client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
