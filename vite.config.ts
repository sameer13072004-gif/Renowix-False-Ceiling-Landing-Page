import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
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
            // Intercept local development gateway requests
            if (req.url && req.url.startsWith('/api/pay') && (req.method === 'POST' || req.method === 'GET')) {
              const isGet = req.method === 'GET';
              
              const executePay = async (name: string, phone: string, amount: number) => {
                try {
                  // 1. Strict extraction of environment variables with NO sandbox fallbacks
                  const merchantId = process.env.PHONEPE_MERCHANT_ID; 
                  const saltKey = process.env.PHONEPE_SALT_KEY;
                  const saltIndex = process.env.PHONEPE_SALT_INDEX || "1";

                  // 2. Fail early locally if the system environment variables are missing
                  if (!merchantId || !saltKey) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify({ 
                      success: false, 
                      error: "Local Infrastructure Error: PHONEPE_MERCHANT_ID or PHONEPE_SALT_KEY is not defined in your local .env file." 
                    }));
                  }

                  // 3. Force absolute production endpoint matching the live corporate pipeline
                  const phonepeHost = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

                  // 4. Sequence variables chronologically BEFORE building the payload object
                  const merchantTransactionId = "RX" + Date.now() + Math.floor(Math.random() * 1000);
                  const merchantUserId = "U" + Math.floor(Math.random() * 1000000);
                  const amountInPaise = Math.round(amount * 100);

                  // 5. Hardcoded production targets to eliminate proxy / domain drops
                  const DOMAIN = "https://renowix.in";

                  // 6. Sanitized PhonePe Standard Hosted checkout schema (No illegal redirectMode parameter)
                  const requestPayload = {
                    merchantId,
                    merchantTransactionId,
                    merchantUserId,
                    amount: amountInPaise,
                    redirectUrl: `${DOMAIN}/false-ceiling`,
                    callbackUrl: `${DOMAIN}/api/webhook`,
                    mobileNumber: phone ? phone.replace(/\D/g, "").slice(-10) : "9999999999",
                    paymentInstrument: {
                      type: "PAY_PAGE"
                    }
                  };

                  // 7. Standard ECMAScript safe binary-to-ascii packaging to prevent Vite compiler crashes
                  const base64Payload = btoa(JSON.stringify(requestPayload));
                  const hashString = base64Payload + "/pg/v1/pay" + saltKey;
                  const sha256Hash = crypto.createHash("sha256").update(hashString).digest("hex");
                  const checksum = sha256Hash + "###" + saltIndex;

                  // 8. Execute high-speed direct gateway handshake
                  const apiResponse = await fetch(phonepeHost, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "X-VERIFY": checksum
                    },
                    body: JSON.stringify({ request: base64Payload })
                  });

                  const responseData = await apiResponse.json() as any;

                  res.setHeader('Access-Control-Allow-Origin', '*');
                  
                  if (responseData.success && responseData.data?.instrumentResponse?.redirectInfo?.url) {
                    if (isGet) {
                      res.writeHead(302, { Location: responseData.data.instrumentResponse.redirectInfo.url });
                      res.end();
                    } else {
                      res.setHeader('Content-Type', 'application/json');
                      res.statusCode = 200;
                      res.end(JSON.stringify({
                        success: true,
                        redirectUrl: responseData.data.instrumentResponse.redirectInfo.url,
                        transactionId: merchantTransactionId
                      }));
                    }
                  } else {
                    // Precise error state diagnostics for debugging credentials
                    if (isGet) {
                      res.setHeader('Content-Type', 'text/html');
                      res.statusCode = 400;
                      res.end(`
                        <div style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; margin: 4rem auto; background: #fff5f5; border: 1px solid #feb2b2; border-radius: 12px;">
                          <h2 style="color: #9b2c2c; margin-top: 0; border-bottom: 2px solid #fed7d7; padding-bottom: 0.5rem;">[Local Server] PhonePe API Verification Failed</h2>
                          <p><strong>System Context Variables Checked:</strong></p>
                          <ul style="color: #2d3748;">
                            <li><strong>Merchant ID:</strong> <code>${merchantId}</code></li>
                            <li><strong>Salt Index:</strong> <code>${saltIndex}</code></li>
                            <li><strong>Salt Key Length:</strong> <code>${saltKey.length} characters</code></li>
                          </ul>
                          <p><strong>Raw Server Payload Response Data:</strong></p>
                          <pre style="background: #1a202c; color: #f7fafc; padding: 1rem; border-radius: 6px; overflow-x: auto;">${JSON.stringify(responseData, null, 2)}</pre>
                        </div>
                      `);
                    } else {
                      res.setHeader('Content-Type', 'application/json');
                      res.statusCode = 400;
                      res.end(JSON.stringify({
                        success: false,
                        error: responseData.message || "Failed to initiate payment transaction with PhonePe."
                      }));
                    }
                  }
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: err.message }));
                }
              };

              // Process inbound system requests
              if (isGet) {
                const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
                const name = urlObj.searchParams.get('name') || 'Diagnostic Test User';
                const phone = urlObj.searchParams.get('phone') || '9999999999';
                const amount = Number(urlObj.searchParams.get('amount')) || 199;
                executePay(name, phone, amount);
              } else {
                let body = '';
                req.on('data', chunk => { body += chunk; });
                req.on('end', async () => {
                  const parsed = body ? JSON.parse(body) : {};
                  executePay(parsed.name || 'Diagnostic', parsed.phone || '9999999999', parsed.amount || 199);
                });
              }
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
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});