import { createClient } from '@supabase/supabase-js';

const url = "https://yagerehtuprnwiwkindg.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhZ2VyZWh0dXBybndpd2tpbmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMDcxMTgsImV4cCI6MjA5OTU4MzExOH0.0WxTdmyZMVT41c5Y3De7N1S2m-TgdIkkGOFpdq9QxoY";

const supabase = createClient(url, anonKey);

async function checkBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Error listing buckets:", error);
  } else {
    console.log("Buckets:", data.map(b => b.name));
    if (!data.find(b => b.name === 'images')) {
      const { data: createData, error: createError } = await supabase.storage.createBucket('images', { public: true });
      if (createError) {
         console.error("Error creating bucket:", createError);
      } else {
         console.log("Created 'images' bucket.");
      }
    }
  }
}

checkBuckets();
