import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pvyxmmturmsxfckajbbu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2eXhtbXR1cm1zeGZja2FqYmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTcyMjYsImV4cCI6MjA3NTc3MzIyNn0.Y0zbjZ1e9ZWsjD-cVaZxOOz28J33HgKo7hkhDEDxics";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;