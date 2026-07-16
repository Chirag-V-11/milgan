const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticatedRateLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validator');

router.use(authenticatedRateLimiter);

// 1. POST /api/shipping/upload
router.post('/upload', validate('orderUpload'), async (req, res) => {
  try {
    const orderData = req.body;
    
    // 1. Get present year
    const presentYear = new Date().getFullYear();

    // 2. Get product id from orderData.productId (or fallback to a default/cleaned string)
    const rawProductId = orderData.productId || '615df5ef';
    const productIdClean = String(rawProductId).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);

    // 3. Get counting numbers (count of existing orders + 1)
    const { count, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    const nextCount = (count || 0) + 1;

    const generatedId = `${presentYear}${productIdClean}${nextCount}`;

    const newOrder = {
      id: generatedId,
      customer_name: orderData.customerName,
      phone: orderData.mobile,
      email: orderData.email || 'customer@example.com',
      address: orderData.address,
      pincode: orderData.pincode,
      city: orderData.city,
      state: orderData.state,
      items: orderData.description,
      declared_value: Number(orderData.declaredValue),
      payment_method: orderData.paymentMethod,
      status: 'Pending Booking'
    };

    const { data: createdOrder, error } = await supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (error) {
      console.error('[Supabase Order Insert Error]', error.message);
      throw error;
    }

    // Map to camelCase for frontend compatibility
    const responseOrder = {
      id: createdOrder.id,
      customerName: createdOrder.customer_name,
      phone: createdOrder.phone,
      email: createdOrder.email,
      address: createdOrder.address,
      pincode: createdOrder.pincode,
      city: createdOrder.city,
      state: createdOrder.state,
      items: createdOrder.items,
      declaredValue: createdOrder.declared_value,
      paymentMethod: createdOrder.payment_method,
      status: createdOrder.status,
      createdAt: createdOrder.created_at
    };

    return res.status(200).json({
      success: true,
      message: 'Order registered successfully.',
      awbNumber: '', 
      order: responseOrder
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/shipping/orders
 * @desc    Get list of all current customer orders from Supabase
 * @access  Public
 */
router.get('/orders', async (req, res) => {
  try {
    const { phone, email } = req.query;
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (phone) {
      // Extract last 10 digits to handle country code prefixes (+91, 0, etc.) flexibly
      const digits = phone.replace(/\D/g, '');
      const last10 = digits.slice(-10);
      if (last10.length === 10) {
        query = query.ilike('phone', `%${last10}`);
      } else {
        query = query.eq('phone', phone);
      }
    } else if (email) {
      query = query.ilike('email', email.trim());
    }

    const { data: orders, error } = await query;
    if (error) {
      console.error('[Supabase Orders Fetch Error]', error.message);
      throw error;
    }

    // Map to camelCase for frontend compatibility
    const mappedOrders = (orders || []).map(o => ({
      id: o.id,
      customerName: o.customer_name,
      phone: o.phone,
      email: o.email,
      address: o.address,
      pincode: o.pincode,
      city: o.city,
      state: o.state,
      items: o.items,
      declaredValue: Number(o.declared_value),
      paymentMethod: o.payment_method,
      status: o.status,
      createdAt: o.created_at
    }));

    return res.status(200).json({
      success: true,
      orders: mappedOrders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 3. PUT /api/shipping/orders/:id/status
router.put('/orders/:id/status', validate('orderStatusUpdate'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({ status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Supabase Order Status Update Error]', error.message);
      throw error;
    }

    // Map to camelCase for frontend compatibility
    const responseOrder = {
      id: updatedOrder.id,
      customerName: updatedOrder.customer_name,
      phone: updatedOrder.phone,
      email: updatedOrder.email,
      address: updatedOrder.address,
      pincode: updatedOrder.pincode,
      city: updatedOrder.city,
      state: updatedOrder.state,
      items: updatedOrder.items,
      declaredValue: Number(updatedOrder.declared_value),
      paymentMethod: updatedOrder.payment_method,
      status: updatedOrder.status,
      createdAt: updatedOrder.created_at
    };

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: responseOrder
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
