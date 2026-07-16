const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticatedRateLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validator');

router.use(authenticatedRateLimiter);

// Helper to extract user ID from request headers
const getUserId = (req) => {
  const header = req.headers['x-user-id'] || req.headers['authorization'];
  return header?.replace('Bearer ', '');
};

// 1. GET /api/cart - Get user's database-backed cart
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(400).json({ error: 'User authorization ID is required' });
    }

    // Fetch joined cart items and product details
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        size,
        quantity,
        product:products (
          id,
          name,
          image_url,
          image_urls,
          quantity_options
        )
      `)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    // Map database results to match the frontend CartItem format
    const mappedCart = data.map((item) => {
      const product = item.product;
      if (!product) return null;

      // Find the specific size price options
      const sizeOpt = product.quantity_options?.find((opt) => opt.size === item.size);
      const baseCost = sizeOpt ? (sizeOpt.baseCost || sizeOpt.price) : 0;
      const discount = sizeOpt ? (sizeOpt.discountPercentage || 0) : 0;
      const finalPrice = discount > 0 ? Math.round(baseCost * (1 - discount / 100)) : baseCost;

      const firstImage = (product.image_urls && product.image_urls[0]) || product.image_url || '';

      return {
        id: product.id,
        name: product.name,
        image: firstImage,
        size: item.size,
        basePrice: finalPrice,
        originalPrice: baseCost,
        quantity: item.quantity
      };
    }).filter(Boolean);

    res.status(200).json(mappedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. POST /api/cart - Add item to cart
router.post('/', validate('cartAdd'), async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId, size, quantity } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User authorization ID is required' });
    }

    // Check if the item already exists in the cart
    const { data: existing, error: findError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size)
      .maybeSingle();

    if (findError) throw findError;

    if (existing) {
      // Update quantity
      const newQty = existing.quantity + quantity;
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: newQty })
        .eq('id', existing.id);
      
      if (updateError) throw updateError;
    } else {
      // Insert new cart item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert([{ user_id: userId, product_id: productId, size, quantity }]);
      
      if (insertError) throw insertError;
    }

    res.status(200).json({ message: 'Artisan curation added to database cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. PUT /api/cart - Update item quantity directly
router.put('/', validate('cartUpdate'), async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId, size, quantity } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User authorization ID is required' });
    }

    if (quantity <= 0) {
      // Remove item
      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('size', size);
      
      if (deleteError) throw deleteError;
      return res.status(200).json({ message: 'Artisan curation removed from database cart' });
    }

    // Update quantity
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size);

    if (updateError) throw updateError;

    res.status(200).json({ message: 'Cart item quantity updated in database' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. DELETE /api/cart - Remove item or clear all cart
router.delete('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId, size } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User authorization ID is required' });
    }

    if (productId && size) {
      // Delete specific item
      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('size', size);
      
      if (deleteError) throw deleteError;
      res.status(200).json({ message: 'Item removed from database cart' });
    } else {
      // Clear entire cart
      const { error: clearError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);
      
      if (clearError) throw clearError;
      res.status(200).json({ message: 'Sanctuary cart cleared in database' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
