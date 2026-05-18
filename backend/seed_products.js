const supabase = require('./src/config/supabase');

const products = [
  {
    name: "Vedic Malai Paneer",
    description: "Sacredly soft, high-protein malai paneer crafted from pure A2 milk using traditional lemon-clotting methods. A velvet masterpiece of purity.",
    image_url: "https://images.unsplash.com/photo-1565060050212-0750c05f7787?auto=format&fit=crop&q=80&w=1000",
    quantity_options: [
      { size: "200g", price: 250 },
      { size: "500g", price: 450 }
    ]
  },
  {
    name: "Artisanal Churned Butter",
    description: "Traditionally churned white butter (Makhan), unsalted and pure. Captured at the peak of freshness from cultured A2 cream.",
    image_url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=1000",
    quantity_options: [
      { size: "250g", price: 350 },
      { size: "500g", price: 600 }
    ]
  }
];

async function seedProducts() {
  console.log("🏺 Initiating Milgan Inventory Expansion...");
  
  for (const product of products) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

      if (error) {
        console.error(`❌ Error adding ${product.name}:`, error.message);
      } else {
        console.log(`✅ Success: ${product.name} has been woven into the vault.`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error for ${product.name}:`, err.message);
    }
  }

  console.log("✨ Expansion complete. The sanctuary is now richer.");
}

seedProducts();
