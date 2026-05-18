const jwt = require('jsonwebtoken');
// built in fetch used

async function testApi() {
  const token = jwt.sign({ id: 'test' }, 'supersecretjwtkey_change_in_production');
  const targetId = 'fa5e16d7-cb3b-471a-b053-1f2f1f8b0b3b';
  
  const payload = {
    name: "bhuchi",
    description: "test description",
    image_url: "",
    quantity_options: [{ size: '1L', baseCost: 100, discountPercentage: 0, stockAvailable: 10 }]
  };

  try {
    const response = await fetch(`http://localhost:5000/api/products/${targetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", data);
  } catch (e) {
    console.log("Fetch failed:", e);
  }
}

testApi();
