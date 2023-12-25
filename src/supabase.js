import { createClient } from '@supabase/supabase-js';
import {supabaseKey,supabaseUrl}  from './apikey';


const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
