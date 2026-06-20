const { XMLParser } = require('fast-xml-parser');

class TrackingService {
  constructor() {
    this.env = process.env.DTDC_ENVIRONMENT || 'staging';
    
    // Choose active endpoint URLs based on environment setting
    this.authUrl = this.env === 'production'
      ? process.env.DTDC_AUTH_PRODUCTION_URL
      : process.env.DTDC_AUTH_STAGING_URL;
      
    this.trackingUrl = this.env === 'production'
      ? process.env.DTDC_TRACKING_PRODUCTION_URL
      : process.env.DTDC_TRACKING_STAGING_URL;

    this.clientId = process.env.DTDC_TRACKING_CLIENT_ID;
    this.clientSecret = process.env.DTDC_TRACKING_CLIENT_SECRET;

    // Cache management variables
    this.cachedToken = null;
    this.tokenExpiresAt = 0; // Epoch timestamp (ms) when token expires

    this.requestTimeoutMs = 10000;
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
  }

  /**
   * Fetches or retrieves the OAuth access token from cache.
   * @returns {Promise<string>} OAuth Bearer Token
   */
  async getAccessToken() {
    const now = Date.now();
    
    // 1. Return cached token if still valid (with a 30-second buffer)
    if (this.cachedToken && now < (this.tokenExpiresAt - 30000)) {
      console.log('[TrackingService] Reusing cached OAuth authorization token.');
      return this.cachedToken;
    }

    console.log('[TrackingService] OAuth token expired or missing. Fetching new token...');

    if (!this.authUrl) {
      throw new Error(`Auth URL is not configured for environment: ${this.env}`);
    }
    if (!this.clientId || !this.clientSecret) {
      throw new Error('OAuth Client ID or Client Secret credentials are missing in environment.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeoutMs);

    try {
      const response = await fetch(this.authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication rejected: Invalid OAuth Client ID or Client Secret.');
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error(`Failed to parse auth server response as JSON: ${text.substring(0, 200)}`);
      }

      if (!response.ok || !data.access_token) {
        throw new Error(data.error || data.message || `Auth failed with status ${response.status}`);
      }

      // Cache token and set expiration. Default to 3600s (1 hour) if expires_in is not returned.
      const expiresInSeconds = data.expires_in || 3600;
      
      this.cachedToken = data.access_token;
      this.tokenExpiresAt = Date.now() + (expiresInSeconds * 1000);
      
      console.log(`[TrackingService] OAuth token acquired successfully. Expires in ${expiresInSeconds}s.`);
      return this.cachedToken;

    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Network timeout: Auth server failed to respond within ${this.requestTimeoutMs / 1000}s.`);
      }
      throw new Error(`Authentication token request failed: ${error.message}`);
    }
  }

  /**
   * Fetches tracking details for a consignment and parses the XML response.
   * @param {string} referenceNumber AWB or tracking number
   * @returns {Promise<Object>} Cleaned JSON status timeline
   */
  async trackShipment(referenceNumber) {
    if (!referenceNumber) {
      throw new Error('Reference number (AWB) is required for tracking.');
    }

    if (!this.trackingUrl) {
      throw new Error(`Tracking endpoint URL is not configured for environment: ${this.env}`);
    }

    // Create AbortController to handle connection timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeoutMs);

    try {
      // 1. Retrieve the active Bearer authentication token
      const token = await this.getAccessToken();

      // 2. Fire the tracking query to the courier
      console.log(`[TrackingService] Querying status for ${referenceNumber} via ${this.trackingUrl}`);
      // Typically tracking can be a POST with XML payload or GET with URL params.
      // We will implement standard query params with Authorization header.
      const response = await fetch(`${this.trackingUrl}?awb=${encodeURIComponent(referenceNumber)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/xml'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 401 || response.status === 403) {
        // Clear token cache since it is invalid
        this.cachedToken = null;
        this.tokenExpiresAt = 0;
        throw new Error('Tracking service rejected authorization. The token may have expired or been revoked.');
      }

      const rawXml = await response.text();

      if (!response.ok) {
        throw new Error(`Tracking API responded with status ${response.status}: ${rawXml.substring(0, 200)}`);
      }

      // 3. Parse XML payload into JSON
      let parsedData;
      try {
        parsedData = this.xmlParser.parse(rawXml);
      } catch (xmlError) {
        throw new Error(`Failed to parse XML response: ${xmlError.message}`);
      }

      // 4. Transform response into standardized JSON structure
      return this.standardizeTrackingResponse(referenceNumber, parsedData);

    } catch (error) {
      clearTimeout(timeoutId);

      // Handle specific network timeout error
      if (error.name === 'AbortError') {
        throw new Error(`Network timeout: Tracking API failed to respond within ${this.requestTimeoutMs / 1000}s.`);
      }

      // Fallback: If in staging environment, return a simulated successful response so it is easy to view
      if (this.env === 'staging') {
        console.warn(`[TrackingService] Staging API query failed (${error.message}). Returning simulated tracking data.`);
        return this.getSimulatedResponse(referenceNumber);
      }

      throw new Error(`Tracking query failed: ${error.message}`);
    }
  }

  /**
   * Standardizes raw parsed XML JSON into our standard visual timeline format.
   * @param {string} awbNumber 
   * @param {Object} parsedXml 
   * @returns {Object} Standardized tracking object
   */
  standardizeTrackingResponse(awbNumber, parsedXml) {
    // DTDC XML elements typically match:
    // <TrackingResponse>
    //   <AWBNo>DTDC12345</AWBNo>
    //   <CurrentStatus>In Transit</CurrentStatus>
    //   <Events>
    //     <Event>
    //       <Status>Out for Delivery</Status>
    //       <Location>Mumbai South</Location>
    //       <Time>2026-06-19 11:20:00</Time>
    //     </Event>
    //   </Events>
    // </TrackingResponse>
    
    // Safe extraction helpers
    const responseRoot = parsedXml.TrackingResponse || parsedXml.ShipmentTrackingResponse || {};
    const currentStatus = responseRoot.CurrentStatus || 'Information Received';
    const lastUpdate = responseRoot.LastUpdateTime || new Date().toISOString();
    
    let rawEvents = [];
    if (responseRoot.Events && responseRoot.Events.Event) {
      const eventVal = responseRoot.Events.Event;
      rawEvents = Array.isArray(eventVal) ? eventVal : [eventVal];
    }

    const history = rawEvents.map(e => ({
      status: e.Status || 'Status Update',
      location: e.Location || 'Sorting Facility',
      timestamp: e.Time ? new Date(e.Time).toISOString() : new Date().toISOString()
    })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Descending order (newest first)

    return {
      awbNumber,
      currentStatus,
      lastUpdate,
      history: history.length > 0 ? history : [
        {
          status: currentStatus,
          location: 'Origin Facility',
          timestamp: lastUpdate
        }
      ]
    };
  }

  /**
   * Generates a realistic mock tracking timeline for staging.
   * @param {string} awbNumber 
   */
  getSimulatedResponse(awbNumber) {
    const now = new Date();
    
    const timeSubtract = (hours) => {
      const d = new Date(now);
      d.setHours(d.getHours() - hours);
      return d.toISOString();
    };

    return {
      awbNumber,
      currentStatus: 'In Transit',
      lastUpdate: timeSubtract(2),
      history: [
        {
          status: 'In Transit',
          location: 'Main Distribution Center, Delhi',
          timestamp: timeSubtract(2)
        },
        {
          status: 'Dispatched',
          location: 'Sort Hub, Bangalore',
          timestamp: timeSubtract(10)
        },
        {
          status: 'Processed',
          location: 'Sorting Facility, Bangalore',
          timestamp: timeSubtract(18)
        },
        {
          status: 'Booked',
          location: 'Milgan Foods Warehouse',
          timestamp: timeSubtract(24)
        }
      ]
    };
  }
}

module.exports = TrackingService;
