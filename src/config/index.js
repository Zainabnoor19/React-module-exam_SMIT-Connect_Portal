import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_URL";
const supabaseKey = "YOUR_KEY";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;