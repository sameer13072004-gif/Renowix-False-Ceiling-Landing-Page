import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration to allow local development and Vercel hosting integration
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
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
    const { name = "Diagnostic Test User", phone = "9999999999", amount = 199 } = isGet ? req.query : (req.body || {});

    // Fetch PhonePe merchant credentials from environment variables
    const merchantId = process.env.PHONEPE_MERCHANT_ID || "PGTESTPAYUAT86"; 
    const saltKey = process.env.REACT_APP_PHONEPE_SALT_KEY || process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX || "1";

    // Setup URLs (Prod vs preprod fallback)
    const isProd = merchantId && !merchantId.startsWith("PGTEST");
    const phonepeHost = isProd 
      ? "https://api.phonepe.com/apis/hermes/pg/v1/pay"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

    if (!saltKey) {
      return res.status(400).json({ 
        success: false, 
        error: "Configuration Error: PHONEPE_SALT_KEY is not defined in Vercel environment variables. Please configure the environment variables on Vercel." 
      });
    }

    // Generate unique transaction ID
    const merchantTransactionId = "RX" + Date.now() + Math.floor(Math.random() * 1000);
    const merchantUserId = "U" + Math.floor(Math.random() * 1000000);

    // Amount to paise
    const amountInPaise = Math.round(amount * 100);

    // Format callback and redirect back to the app domain url dynamically
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
    const appOrigin = `${protocol}://${host}`;

    // Request payload structure as required by PhonePe's Hosted Payment Page API (PAY_PAGE)
    const requestPayload = {
      merchantId,
      merchantTransactionId,
      merchantUserId,
      amount: amountInPaise,
      redirectUrl: `${appOrigin}/?status=success&txn=${merchantTransactionId}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${appOrigin}/api/pay-callback`,
      mobileNumber: phone ? phone.replace(/\D/g, "").slice(-10) : "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    // Base64 encode request payload
    const base64Payload = Buffer.from(JSON.stringify(requestPayload)).toString("base64");

    // Compute checksum hash: SHA256(base64Payload + "/pg/v1/pay" + saltKey) + "###" + saltIndex
    const hashString = base64Payload + "/pg/v1/pay" + saltKey;
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
        error: responseData.message || "Failed to initiate payment transaction with PhonePe."
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
