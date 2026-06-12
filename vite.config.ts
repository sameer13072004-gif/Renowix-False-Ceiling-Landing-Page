import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import crypto from 'crypto';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'api-pay-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url?.startsWith('/api/pay') && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const { name, phone, amount = 199 } = body ? JSON.parse(body) : {};
                  
                  // Read env vars or use test/live credentials
                  const merchantId = process.env.PHONEPE_MERCHANT_ID || "PGTESTPAYUAT86"; 
                  const saltKey = process.env.PHONEPE_SALT_KEY || "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"; // default preprod salt key for seamless local test
                  const saltIndex = process.env.PHONEPE_SALT_INDEX || "1";

                  const isProd = merchantId && !merchantId.startsWith("PGTEST");
                  const phonepeHost = isProd 
                    ? "https://api.phonepe.com/apis/hermes/pg/v1/pay"
                    : "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

                  // In local sandbox, we can proceed with ease!
                  const merchantTransactionId = "RX" + Date.now() + Math.floor(Math.random() * 1000);
                  const merchantUserId = "U" + Math.floor(Math.random() * 1000000);
                  const amountInPaise = Math.round(amount * 100);

                  const host = req.headers.host || "localhost:3000";
                  const protocol = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
                  const appOrigin = `${protocol}://${host}`;

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

                  const base64Payload = Buffer.from(JSON.stringify(requestPayload)).toString("base64");
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

                  const responseData = await apiResponse.json() as any;

                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  if (responseData.success && responseData.data?.instrumentResponse?.redirectInfo?.url) {
                    res.statusCode = 200;
                    res.end(JSON.stringify({
                      success: true,
                      redirectUrl: responseData.data.instrumentResponse.redirectInfo.url,
                      transactionId: merchantTransactionId
                    }));
                  } else {
                    res.statusCode = 400;
                    res.end(JSON.stringify({
                      success: false,
                      error: responseData.message || "Failed to initiate payment transaction with PhonePe."
                    }));
                  }
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: err.message }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
