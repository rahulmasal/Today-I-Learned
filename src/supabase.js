import { createClient } from '@supabase/supabase-js';

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFya3Z3Y3lhZ2FlZHZub2FrenB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMxMjIxMTMsImV4cCI6MjAxODY5ODExM30.HS3Tgj11RriL_D3MrqaXzuonmQR5ZDXM9hMocb7JKEM";
const supabaseUrl = "https://qrkvwcyagaedvnoakzpv.supabase.co";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
