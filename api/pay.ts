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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, phone, amount = 199 } = req.body || {};

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

    // Format callback and redirect back to the app domain url
    const productionDomain = "https://renowix.in";
    const appOrigin = isProd ? productionDomain : (() => {
      const protocol = req.headers["x-forwarded-proto"] || "https";
      const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
      return `${protocol}://${host}`;
    })();

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
      return res.status(200).json({
        success: true,
        redirectUrl: responseData.data.instrumentResponse.redirectInfo.url,
        transactionId: merchantTransactionId
      });
    } else {
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
