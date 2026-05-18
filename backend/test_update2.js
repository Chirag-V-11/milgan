require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testUpdate() {
  const targetId = 'fe5c41e8-b658-423e-9813-0884e746824f';
  console.log("Updating product:", targetId);
  
  const { data, error } = await supabase
    .from('products')
    .update({ 
      name: "Test Update"
    })
    .eq('id', targetId)
    .select();
    
  console.log("Error:", error);
  console.log("Data:", data);
}

testUpdate();
