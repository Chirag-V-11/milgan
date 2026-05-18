require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testUpdate() {
  console.log("Testing update...");
  const { data: getProducts, error: getErr } = await supabase.from('products').select('*').limit(1);
  if (getErr || !getProducts.length) {
    console.log("Error getting product", getErr);
    return;
  }
  
  const p = getProducts[0];
  console.log("Updating product:", p.id);
  
  const { data, error } = await supabase
    .from('products')
    .update({ 
      name: p.name + " Test", 
      description: p.description, 
      image_url: p.image_url, 
      image_urls: p.image_urls || [], 
      amazon_url: p.amazon_url || "", 
      blinkit_url: p.blinkit_url || "", 
      quantity_options: p.quantity_options 
    })
    .eq('id', p.id)
    .select();
    
  if (error) {
    console.error("SUPABASE ERROR:", error);
  } else {
    console.log("SUCCESS:", data);
    // Revert
    await supabase.from('products').update({ name: p.name }).eq('id', p.id);
  }
}

testUpdate();
