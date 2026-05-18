require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
async function testFullUpdate() {
  const targetId = 'fa5e16d7-cb3b-471a-b053-1f2f1f8b0b3b';
  const payload = {
    name: "bhuchi",
    description: "test description",
    image_url: "",
    quantity_options: [{ size: '1L', baseCost: 100, discountPercentage: 0, stockAvailable: 10 }]
  };
  const { data, error } = await supabase.from('products').update(payload).eq('id', targetId).select();
  console.log("Supabase Error:", error);
  console.log("Data:", data);
}
testFullUpdate();
