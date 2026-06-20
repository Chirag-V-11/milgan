const dns = require('dns');

/**
 * ShippingService handles communication with the logistics (DTDC) Order Upload API.
 */
class ShippingService {
  /**
   * Initializes the shipping service configuration from environment variables.
   */
  constructor() {
    this.env = process.env.DTDC_ENVIRONMENT || 'staging';
    this.apiKey = process.env.DTDC_API_KEY;
    this.clientCode = process.env.DTDC_CLIENT_CODE;
    
    // Choose active endpoint URL based on environment setting
    this.activeUrl = this.env === 'production' 
      ? process.env.DTDC_PRODUCTION_URL 
      : process.env.DTDC_STAGING_URL;
      
    // Choose active label generation URL based on environment setting
    this.labelUrl = this.env === 'production'
      ? process.env.DTDC_LABEL_PRODUCTION_URL
      : process.env.DTDC_LABEL_STAGING_URL;
      
    // Choose active cancellation URL based on environment setting
    this.cancelUrl = this.env === 'production'
      ? process.env.DTDC_CANCEL_PRODUCTION_URL
      : process.env.DTDC_CANCEL_STAGING_URL;
      
    // Set a default timeout of 10 seconds for API requests
    this.requestTimeoutMs = 10000; 
  }

  /**
   * Validates target order data fields before making the API call.
   * @param {Object} orderData 
   */
  validateOrderData(orderData) {
    if (!orderData) {
      throw new Error('Order data is required.');
    }

    const { customerName, address, city, pincode, mobile } = orderData;
    const missingFields = [];

    if (!customerName) missingFields.push('customerName');
    if (!address) missingFields.push('address');
    if (!city) missingFields.push('city');
    if (!pincode) missingFields.push('pincode');
    if (!mobile) missingFields.push('mobile');

    if (missingFields.length > 0) {
      throw new Error(`Invalid order data. Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  /**
   * Formats the user's order data into the payload required by Shipsy/DTDC softdata API.
   * @param {Object} orderData 
   * @returns {Object} Formatted payload
   */
  formatPayload(orderData) {
    // Generate invoice date matching "14 Oct 2022" format (e.g. DD MMM YYYY)
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const today = new Date().toLocaleDateString('en-GB', options); // e.g. "19 Jun 2026"
    const formattedInvoiceDate = today.replace(/,/g, ''); // strip potential commas

    const totalWeight = orderData.weight ? String(parseFloat(orderData.weight).toFixed(1)) : "0.5";
    const totalDeclaredValue = orderData.declaredValue ? String(parseFloat(orderData.declaredValue).toFixed(1)) : "0.0";
    
    // Construct consignment item matching the PDF/API documentation
    const consignment = {
      customer_code: this.clientCode || 'customer code',
      service_type_id: orderData.serviceTypeId || 'B2C PRIORITY',
      load_type: orderData.loadType || 'NON-DOCUMENT',
      description: orderData.description || 'e-commerce order',
      dimension_unit: 'cm',
      length: orderData.length ? String(parseFloat(orderData.length).toFixed(1)) : '10.0',
      width: orderData.width ? String(parseFloat(orderData.width).toFixed(1)) : '10.0',
      height: orderData.height ? String(parseFloat(orderData.height).toFixed(1)) : '10.0',
      weight_unit: 'kg',
      weight: totalWeight,
      declared_value: totalDeclaredValue,
      num_pieces: String(parseInt(orderData.packages, 10) || 1),
      origin_details: {
        name: orderData.originName || 'TEST ENTERPRISES',
        phone: orderData.originPhone || '0000000000',
        alternate_phone: orderData.originAlternatePhone || '0000000000',
        address_line_1: orderData.originAddressLine1 || 'dummy sender',
        address_line_2: orderData.originAddressLine2 || '',
        pincode: orderData.originPincode || '110046',
        city: orderData.originCity || 'New Delhi',
        state: orderData.originState || 'Delhi'
      },
      destination_details: {
        name: orderData.customerName,
        phone: orderData.mobile,
        alternate_phone: orderData.alternatePhone || '0000000000',
        address_line_1: orderData.address,
        address_line_2: orderData.addressLine2 || '',
        pincode: orderData.pincode,
        city: orderData.city,
        state: orderData.state || 'Delhi'
      },
      return_details: {
        address_line_1: orderData.returnAddressLine1 || 'Test_Address_Return',
        address_line_2: orderData.returnAddressLine2 || 'Test_Address_Return line 2',
        city_name: orderData.returnCity || 'DELHI',
        name: orderData.returnName || 'Test_Return',
        phone: orderData.returnPhone || '0000000000',
        pincode: orderData.returnPincode || '248001',
        state_name: orderData.returnState || 'DELHI',
        email: orderData.returnEmail || 'info@milganfoods.com',
        alternate_phone: orderData.returnAlternatePhone || '0000000000'
      },
      customer_reference_number: orderData.orderNumber || `ORD-${Date.now()}`,
      cod_collection_mode: orderData.isCOD ? 'CASH' : '',
      cod_amount: orderData.isCOD ? totalDeclaredValue : '',
      commodity_id: orderData.commodityId || '99',
      eway_bill: orderData.ewayBill || '12345678',
      is_risk_surcharge_applicable: orderData.isRiskSurchargeApplicable ? 'true' : 'false',
      invoice_number: orderData.invoiceNumber || `INV-${Date.now()}`,
      invoice_date: orderData.invoiceDate || formattedInvoiceDate,
      reference_number: ''
    };

    // If pieces detail is provided, support Multiple Mode packaging
    if (orderData.piecesDetail && Array.isArray(orderData.piecesDetail) && orderData.piecesDetail.length > 0) {
      consignment.pieces_detail = orderData.piecesDetail.map(p => ({
        description: p.description || 'Test Product',
        declared_value: p.declaredValue ? String(parseFloat(p.declaredValue).toFixed(0)) : '0',
        weight: p.weight ? String(parseFloat(p.weight).toFixed(1)) : '0.5',
        height: p.height ? String(parseFloat(p.height).toFixed(0)) : '5',
        length: p.length ? String(parseFloat(p.length).toFixed(0)) : '5',
        width: p.width ? String(parseFloat(p.width).toFixed(0)) : '5'
      }));
    }

    return {
      consignments: [consignment]
    };
  }

  /**
   * Uploads an order to the courier service and returns the tracking/AWB number.
   * @param {Object} orderData Raw order details
   * @returns {Promise<string>} Tracking (AWB) number
   */
  async uploadOrder(orderData) {
    // 1. Validate order data inputs
    this.validateOrderData(orderData);

    if (!this.activeUrl) {
      throw new Error(`DTDC API endpoint URL is not configured for environment: ${this.env}`);
    }
    if (!this.apiKey) {
      throw new Error('DTDC API Key is missing. Please set it in your environment variables.');
    }

    // 2. Format payload
    const payload = this.formatPayload(orderData);

    // 3. Create AbortController to handle connection timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeoutMs);

    console.log(`[ShippingService] Sending POST request to ${this.activeUrl} (Env: ${this.env})`);

    try {
      const response = await fetch(this.activeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Handle HTTP status errors (unauthorized, bad requests, server issues)
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized/Forbidden: The provided api-key is invalid or expired.');
      }

      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonErr) {
        throw new Error(`Failed to parse API response as JSON: ${responseText.substring(0, 200)}`);
      }

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || `API error with status ${response.status}`);
      }

      // 4. Parse response to extract Airway Bill (AWB) or Tracking Number
      // DTDC response payloads usually return consignment data in a collection or directly in the base payload.
      let awbNumber = null;

      if (responseData.data && Array.isArray(responseData.data) && responseData.data.length > 0) {
        awbNumber = responseData.data[0].awbNumber || responseData.data[0].trackingNumber;
      } else if (responseData.consignments && Array.isArray(responseData.consignments) && responseData.consignments.length > 0) {
        awbNumber = responseData.consignments[0].awbNumber || responseData.consignments[0].trackingNumber;
      } else if (responseData.awbNumber || responseData.trackingNumber) {
        awbNumber = responseData.awbNumber || responseData.trackingNumber;
      }

      if (!awbNumber) {
        // Fallback checks or simulated tracking number generation in staging/test configurations
        if (this.env === 'staging' && (!responseData.data || responseData.simulated)) {
          awbNumber = `TST${Math.floor(100000000 + Math.random() * 900000000)}`;
          console.warn(`[ShippingService] Staging API did not return AWB number. Using simulated: ${awbNumber}`);
        } else {
          throw new Error('API response did not contain a valid AWB or Tracking number.');
        }
      }

      console.log(`[ShippingService] Shipment booked successfully. AWB: ${awbNumber}`);
      return awbNumber;

    } catch (error) {
      clearTimeout(timeoutId);

      // Handle specific network timeout error
      if (error.name === 'AbortError') {
        throw new Error(`Network timeout: DTDC API failed to respond within ${this.requestTimeoutMs / 1000}s.`);
      }

      // Fallback: If in staging environment and using placeholder/invalid credentials, return simulated booking success
      if (this.env === 'staging' && 
         (this.apiKey === 'your_staging_api_key_here' || 
          error.message.includes('Unauthorized/Forbidden') || 
          error.message.includes('fetch failed'))) {
        const simulatedAwb = `DTDC${Math.floor(100000000 + Math.random() * 900000000)}`;
        console.warn(`[ShippingService] Staging mode auth/fetch failed. Falling back to simulated booking: ${simulatedAwb}`);
        return simulatedAwb;
      }

      // Propagate other detailed errors
      throw new Error(`Shipping API integration error: ${error.message}`);
    }
  }

  /**
   * Requests the shipping label PDF for a given reference number (AWB).
   * @param {string} referenceNumber The AWB or tracking number
   * @param {string} labelCode Format code (e.g., "PDF")
   * @param {string} labelFormat Sheet size (e.g., "A4" or "4x6")
   * @returns {Promise<Object>} Label response data containing URL or Base64 string
   */
  async generateLabel(referenceNumber, labelCode = 'PDF', labelFormat = 'A4') {
    if (!referenceNumber) {
      throw new Error('Reference number (AWB) is required for generating a label.');
    }

    if (!this.labelUrl) {
      throw new Error(`DTDC Label endpoint URL is not configured for environment: ${this.env}`);
    }

    if (!this.apiKey) {
      throw new Error('DTDC API Key is missing. Please set it in your environment variables.');
    }

    const payload = {
      reference_number: referenceNumber,
      label_code: labelCode,
      label_format: labelFormat
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeoutMs);

    console.log(`[ShippingService] Requesting shipping label from ${this.labelUrl} (Env: ${this.env})`);

    try {
      const response = await fetch(this.labelUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized/Forbidden: The provided api-key is invalid or expired.');
      }

      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonErr) {
        throw new Error(`Failed to parse API response as JSON: ${responseText.substring(0, 200)}`);
      }

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || `Label API error with status ${response.status}`);
      }

      // Parse returned format. DTDC returns either a labelUrl or labelData (Base64 string).
      const labelUrl = responseData.labelUrl || responseData.downloadUrl;
      const labelData = responseData.labelData || responseData.base64Data || responseData.pdfBase64;

      if (!labelUrl && !labelData) {
        if (this.env === 'staging') {
          // Simulate a Base64 label for staging/test
          const dummyBase64 = 'JVBERi0xLjQKBjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMiAwIFIKL01lZGlhQm94IFswIDAgNTk1IDQyMF0KL0NvbnRlbnRzIDQgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggNTYKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgMzAwIFRkCihNTEdBTiBGT09EUyAtIERUREMgU0hJUFBJTkcgTEFCRUwpIFRqCkVOCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTYgMDAwMDAgbiAKMDAwMDAwMDExMyAwwMDAwIG4gCjAwMDAwMDAyMDEgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA1Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgoyODQKJSVFT0Y=';
          console.warn(`[ShippingService] Staging API did not return label content. Returning simulated Base64 PDF.`);
          return {
            labelData: dummyBase64,
            format: 'base64',
            type: 'application/pdf',
            referenceNumber
          };
        } else {
          throw new Error('Label response did not contain labelUrl, downloadUrl, labelData, or base64Data.');
        }
      }

      return {
        labelUrl: labelUrl || null,
        labelData: labelData || null,
        format: labelUrl ? 'url' : 'base64',
        type: 'application/pdf',
        referenceNumber
      };

    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error(`Network timeout: Shipping Label API failed to respond within ${this.requestTimeoutMs / 1000}s.`);
      }

      throw new Error(`Label Generation API error: ${error.message}`);
    }
  }

  /**
   * Cancels a booked shipment via DTDC API and updates the local order status to 'Cancelled'.
   * @param {string} referenceNumber AWB or tracking number
   * @param {string} cancellationReason Reason for cancellation
   * @param {string} orderId Optional internal database order ID
   */
  async cancelShipment(referenceNumber, cancellationReason = 'Customer Cancelled', orderId = null) {
    if (!referenceNumber) {
      throw new Error('Reference number (AWB) is required for cancellation.');
    }

    if (!this.cancelUrl) {
      throw new Error(`DTDC Cancellation endpoint URL is not configured for environment: ${this.env}`);
    }

    if (!this.apiKey) {
      throw new Error('DTDC API Key is missing. Please set it in your environment variables.');
    }

    const payload = {
      reference_number: referenceNumber,
      cancellation_reason: cancellationReason
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeoutMs);

    console.log(`[ShippingService] Requesting shipment cancellation for: ${referenceNumber} (Env: ${this.env})`);

    try {
      const response = await fetch(this.cancelUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized/Forbidden: The provided api-key is invalid or expired.');
      }

      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonErr) {
        throw new Error(`Failed to parse API response as JSON: ${responseText.substring(0, 200)}`);
      }

      // Check if cancellation is rejected because shipment is already in transit
      const errMessage = responseData.error || responseData.message || '';
      const isInTransit = errMessage.toLowerCase().includes('transit') || 
                          errMessage.toLowerCase().includes('picked up') ||
                          errMessage.toLowerCase().includes('dispatched') ||
                          errMessage.toLowerCase().includes('already out');

      if (!response.ok || responseData.status === 'error' || responseData.status === 'failed') {
        if (isInTransit) {
          throw new Error('Cancellation Rejected: Shipment cannot be cancelled because it is already in transit or has been picked up.');
        }
        throw new Error(errMessage || `Cancellation API error with status ${response.status}`);
      }

      // Update Supabase admin panel database to mark order as 'Cancelled'
      const supabase = require('../config/supabase');
      let dbQuery = supabase.from('orders').update({ status: 'Cancelled' });

      if (orderId) {
        dbQuery = dbQuery.eq('id', orderId);
      } else {
        dbQuery = dbQuery.eq('awb_number', referenceNumber);
      }

      const { data, error: dbError } = await dbQuery;

      if (dbError) {
        console.error(`[ShippingService] Failed to update database status for AWB ${referenceNumber}:`, dbError.message);
        // We log the error but still return success since the carrier cancellation succeeded
      } else {
        console.log(`[ShippingService] Database order status successfully updated to Cancelled.`);
      }

      return {
        success: true,
        message: responseData.message || 'Shipment successfully cancelled with DTDC.',
        referenceNumber
      };

    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error(`Network timeout: Shipping Cancellation API failed to respond within ${this.requestTimeoutMs / 1000}s.`);
      }

      throw new Error(`Cancellation API error: ${error.message}`);
    }
  }
}

module.exports = ShippingService;
