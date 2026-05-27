const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return res.status(404).json({ error: 'Product not found' });
      }
      throw error;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new product (Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, image_url, quantity_options } = req.body;

    if (!name || !quantity_options) {
      return res.status(400).json({ error: 'Name and quantity options are required' });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        { name, description, image_url, quantity_options }
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an existing product (Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, quantity_options } = req.body;

    console.log(`[Updating Product ${id}]`, { name });

    const { data, error } = await supabase
      .from('products')
      .update({ name, description, image_url, quantity_options })
      .eq('id', id)
      .select();

    if (error) {
      console.error('[Supabase Error]', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.error('[Update Blocked] Zero rows updated. This is usually caused by Supabase Row Level Security (RLS) blocking the UPDATE operation.');
      return res.status(403).json({ error: 'Update blocked by Supabase database policies. Please disable RLS on the products table.' });
    }
    
    console.log('[Update Success]', data[0].name);
    res.status(200).json(data[0]);
  } catch (error) {
    console.error('[Update Failed]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete a product (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[Attempting to Delete Product ${id}]`);

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Delete Error]', error);
      throw error;
    }
    
    console.log('[Delete Success]', id);
    res.status(200).json({ message: 'Masterpiece removed from vault' });
  } catch (error) {
    console.error('[Delete Failed]', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
