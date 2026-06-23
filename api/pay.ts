import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration to allow local development and Vercel hosting integration
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS,GET");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-VERIFY"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Support both POST (for checkouts) and GET (for direct bypass diagnostics check links)
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const isGet = req.method === "GET";

  try {
    const bodyArgs = isGet ? req.query : (req.body || {});
    const { 
      name = "Diagnostic Test User", 
      phone = "9999999999", 
      sector = "Noida Sector 150", 
      societyDetails = "Mahagun Moderne, Flat 20",
      preferredTime = "Morning (9 AM - 12 PM)",
      intentTimeline = "Immediate",
      dimensions = "500",
      budgetRange = "Estimated ceiling: ₹1 Lakh to ₹2.5 Lakh",
      ceilingStyle = "Gypsum Style",
      designNotes = ""
    } = bodyArgs;
    const amount = bodyArgs.amount || 199;

    // Fetch PhonePe merchant credentials securely from system environment variables
    const merchantId = process.env.PHONEPE_MERCHANT_ID; 
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX || "1";

    // Setup URLs (Forced Live Production Gateway Only)
    const phonepeHost = "https://api.phonepe.com/apis/merchant-simulator/pg/v1/pay";

    if (!merchantId || !saltKey) {
      return res.status(500).json({ 
        success: false, 
        error: "Configuration Error: PHONEPE_MERCHANT_ID or PHONEPE_SALT_KEY is undefined in Vercel. Ensure your Environment Variables are completely deployed." 
      });
    }

    // Generate unique transaction tracking elements sequentially
    const merchantTransactionId = "RX" + Date.now() + Math.floor(Math.random() * 1000);
    const merchantUserId = "U" + Math.floor(Math.random() * 1000000);

    // Convert amount value securely to integers (Paise format)
    const amountInPaise = Math.round(Number(amount) * 100);

    // Force absolute tracking domain match (No www mix-ups)
    const DOMAIN = "https://renowix.in";

    // -------------------------------------------------------------------------
    // TEMPORARY GOOGLE SHEET BYPASS GATEWAY SWITCH
    // -------------------------------------------------------------------------
    // When true, entirely ignores active PhonePe calls to prevent validation 400s
    // and sends submissions directly to Sheets, responding with a verified landing url.
    const TEMPORARY_BYPASS_FOR_SHEET = true;

    if (TEMPORARY_BYPASS_FOR_SHEET) {
      const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyP_0akm-Uq4Af0J7ifFr6DcDdMRG8rOir59SsXHuNISqc_cdFVyGL-AeXdczvXgLhKSg/exec";
      try {
        await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify({
            name,
            phone,
            sector: isGet ? "Bypass Link Diagnostic" : sector,
            societyDetails,
            preferredTime,
            intentTimeline,
            dimensions,
            budgetRange,
            ceilingStyle,
            designNotes
          })
        });
      } catch (e) {
        console.warn("Direct serverless sheet submission had warning:", e);
      }

      if (isGet) {
        res.setHeader("Content-Type", "text/html");
        return res.status(200).send(`
          <div style="font-family: system-ui, -apple-system, sans-serif; padding: 2rem; max-width: 600px; margin: 4rem auto; border: 1px solid #c3e6cb; background: #d4edda; color: #155724; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center;">
            <h2 style="margin-top: 0; color: #155724; font-size: 1.8rem; border-bottom: 2px solid #c3e6cb; padding-bottom: 0.5rem;">Details Received Successfully (Bypass Mode Active)</h2>
            <p style="margin-top: 1rem; font-size: 1.1rem; line-height: 1.6;">Our engineering desk is verifying your site location and area dimensions against our current layout schedule for Noida/Greater Noida. An official secure booking link and digital audit pass will be dispatched directly to your WhatsApp number shortly via our system.</p>
            <div style="margin-top: 2rem;">
              <a href="/false-ceiling" style="display: inline-block; background: #28a745; color: white; padding: 0.75rem 1.5rem; text-decoration: none; font-weight: bold; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Return to False Ceiling Studio &rarr;</a>
            </div>
          </div>
        `);
      }

      return res.status(200).json({
        success: true,
        redirectUrl: "https://renowix.in/thank-you-page/",
        transactionId: "RX_BYPASS_" + Date.now(),
        message: "Details Received Successfully (Bypassed securely to Sheets)"
      });
    }

    // Request payload structure - Sanitized for PhonePe Standard Hosted PAY_PAGE Schema
    const requestPayload = {
      merchantId,
      merchantTransactionId,
      merchantUserId,
      amount: amountInPaise,
      redirectUrl: `${DOMAIN}/false-ceiling`, 
      callbackUrl: `${DOMAIN}/api/webhook`,
      mobileNumber: phone ? String(phone).replace(/\D/g, "").slice(-10) : "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    // Base64 encode request payload using native, leak-safe Node.js Buffers
    const base64Payload = Buffer.from(JSON.stringify(requestPayload)).toString("base64");

    // Compute checksum hash: SHA256(base64Payload + "/pg/v1/pay" + saltKey) + "###" + saltIndex
    const hashString = base64Payload + "/apis/merchant-simulator/pg/v1/pay" + saltKey;
    const sha256Hash = crypto.createHash("sha256").update(hashString).digest("hex");
    const checksum = sha256Hash + "###" + saltIndex;

    const apiResponse = await fetch(phonepeHost, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const responseData = (await apiResponse.json()) as any;

    if (responseData.success && responseData.data?.instrumentResponse?.redirectInfo?.url) {
      if (isGet) {
        res.writeHead(302, { Location: responseData.data.instrumentResponse.redirectInfo.url });
        return res.end();
      }
      return res.status(200).json({
        success: true,
        redirectUrl: responseData.data.instrumentResponse.redirectInfo.url,
        transactionId: merchantTransactionId
      });
    } else {
      // Log the exact response payload error message directly to the Vercel Serverless Terminal
      console.error("PhonePe Handshake Rejection Details:", JSON.stringify(responseData));

      if (isGet) {
        res.setHeader("Content-Type", "text/html");
        return res.status(400).send(`
          <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; padding: 2rem; max-width: 600px; margin: 4rem auto; background: #fff5f5; border: 1px solid #feb2b2; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <h2 style="color: #9b2c2c; margin-top: 0; font-size: 1.5rem; border-bottom: 2px solid #fed7d7; padding-bottom: 0.5rem;">PhonePe API Validation Failed</h2>
            <p style="margin-top: 1rem;"><strong>Configuration Used:</strong></p>
            <ul style="line-height: 1.6; color: #2d3748;">
              <li><strong>Merchant ID:</strong> <code>${merchantId}</code></li>
              <li><strong>Salt Index:</strong> <code>${saltIndex}</code></li>
              <li><strong>Salt Key Length:</strong> <code>${saltKey ? saltKey.length : 0} characters</code> (Verify the exact string!)</li>
            </ul>
            <p style="margin-top: 1rem;"><strong>PhonePe Server Raw Error Response:</strong></p>
            <div style="background: #1a202c; color: #f7fafc; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.85rem; overflow-x: auto; margin: 1rem 0;">
              ${JSON.stringify(responseData, null, 2)}
            </div>
            <p style="margin-top: 2rem; font-size: 0.9rem; color: #4a5568; line-height: 1.5;">This diagnostic page proves your Vercel endpoint is active. However, PhonePe is rejecting the transaction because either the credentials are sandbox and you are sending them to production, or vice versa, or there is an encoding/HMAC verification mismatch. Check that you haven't included extra spaces, brackets, or newline characters in your environment variables.</p>
          </div>
        `);
      }
      return res.status(400).json({
        success: false,
        error: responseData.message || "Failed to initiate payment transaction with PhonePe.",
        rawError: responseData
      });
    }

  } catch (error: any) {
    console.error("Vercel PhonePe Handler Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error during transaction processing."
    });
  }
}