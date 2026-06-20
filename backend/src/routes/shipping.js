const express = require('express');
const router = express.Router();
const ShippingService = require('../services/shippingService');
const TrackingService = require('../services/trackingService');

// Initialize the Shipping and Tracking Services
const shippingService = new ShippingService();
const trackingService = new TrackingService();

/**
 * @route   POST /api/shipping/upload
 * @desc    Upload order metadata to DTDC logistics and receive Airway Bill (AWB)
 * @access  Public (or protected if admin authorization middleware is desired)
 */
router.post('/upload', async (req, res) => {
  try {
    const orderData = req.body;

    // Trigger the shipping service to validate, format and send consignment
    const awbNumber = await shippingService.uploadOrder(orderData);

    return res.status(200).json({
      success: true,
      message: 'Shipment uploaded successfully to DTDC.',
      awbNumber: awbNumber,
      environment: shippingService.env
    });

  } catch (error) {
    console.error('[Shipping Route Error]', error.message);
    
    // Check specific validation vs API server errors to respond with appropriate status codes
    const isValidationError = error.message.includes('Missing required fields') || error.message.includes('Invalid order data');
    const isAuthError = error.message.includes('Unauthorized/Forbidden');

    let statusCode = 500;
    if (isValidationError) statusCode = 400;
    else if (isAuthError) statusCode = 401;

    return res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/shipping/generate-label
 * @desc    Generate PDF shipping label for a booked shipment reference (AWB)
 * @access  Public (or protected if admin authorization middleware is desired)
 */
router.post('/generate-label', async (req, res) => {
  try {
    const { referenceNumber, labelCode, labelFormat } = req.body;

    if (!referenceNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: referenceNumber'
      });
    }

    const labelResult = await shippingService.generateLabel(referenceNumber, labelCode, labelFormat);

    return res.status(200).json({
      success: true,
      message: 'Shipping label generated successfully.',
      ...labelResult
    });

  } catch (error) {
    console.error('[Shipping Label Route Error]', error.message);

    const isAuthError = error.message.includes('Unauthorized/Forbidden');
    const statusCode = isAuthError ? 401 : 500;

    return res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/shipping/cancel
 * @desc    Cancel a booked shipment by AWB reference
 * @access  Public (or protected if admin authorization middleware is desired)
 */
router.post('/cancel', async (req, res) => {
  try {
    const { referenceNumber, cancellationReason, orderId } = req.body;

    if (!referenceNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: referenceNumber'
      });
    }

    const cancelResult = await shippingService.cancelShipment(referenceNumber, cancellationReason, orderId);

    return res.status(200).json({
      success: true,
      ...cancelResult
    });

  } catch (error) {
    console.error('[Shipping Cancellation Route Error]', error.message);

    const isAuthError = error.message.includes('Unauthorized/Forbidden');
    const isTransitRejection = error.message.includes('Cancellation Rejected');
    
    let statusCode = 500;
    if (isAuthError) statusCode = 401;
    else if (isTransitRejection) statusCode = 400;

    return res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/shipping/track/:awb
 * @desc    Get shipment tracking updates timeline
 * @access  Public
 */
router.get('/track/:awb', async (req, res) => {
  try {
    const { awb } = req.params;

    if (!awb) {
      return res.status(400).json({
        success: false,
        error: 'Missing AWB tracking number parameter'
      });
    }

    const trackingResult = await trackingService.trackShipment(awb);

    return res.status(200).json({
      success: true,
      tracking: trackingResult
    });

  } catch (error) {
    console.error('[Shipping Tracking Route Error]', error.message);

    const isAuthError = error.message.includes('Authentication rejected') || 
                        error.message.includes('Authorization rejected') ||
                        error.message.includes('Unauthorized/Forbidden');

    const statusCode = isAuthError ? 401 : 500;

    return res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
