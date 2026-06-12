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
            if (req.url && req.url.startsWith('/api/pay') && (req.method === 'POST' || req.method === 'GET')) {
              const isGet = req.method === 'GET';
              
              const executePay = async (name: string, phone: string, amount: number) => {
                try {
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

                  // Hardcoded absolute paths as requested to bypass dynamic host detection and avoid firewall issues
                  const DOMAIN = "https://renowix.in";

                  const requestPayload = {
                    merchantId,
                    merchantTransactionId,
                    merchantUserId,
                    amount: amountInPaise,
                    redirectUrl: `${DOMAIN}/false-ceiling`,
                    redirectMode: "REDIRECT",
                    callbackUrl: `${DOMAIN}/api/webhook`,
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
                    if (isGet) {
                      res.setHeader('Content-Type', 'text/html');
                      res.statusCode = 400;
                      res.end(`
                        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; padding: 2rem; max-width: 600px; margin: 4rem auto; background: #fff5f5; border: 1px solid #feb2b2; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                          <h2 style="color: #9b2c2c; margin-top: 0; font-size: 1.5rem; border-bottom: 2px solid #fed7d7; padding-bottom: 0.5rem;">[Local Dev] PhonePe API Validation Failed</h2>
                          <p style="margin-top: 1rem;"><strong>Configuration Used Local Dev:</strong></p>
                          <ul style="line-height: 1.6; color: #2d3748;">
                            <li><strong>Merchant ID:</strong> <code>${merchantId}</code></li>
                            <li><strong>Salt Index:</strong> <code>${saltIndex}</code></li>
                            <li><strong>Salt Key Length:</strong> <code>${saltKey ? saltKey.length : 0} characters</code></li>
                          </ul>
                          <p style="margin-top: 1rem;"><strong>PhonePe Server Error Response:</strong></p>
                          <div style="background: #1a202c; color: #f7fafc; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.85rem; overflow-x: auto; margin: 1rem 0;">
                            ${JSON.stringify(responseData, null, 2)}
                          </div>
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

              if (isGet) {
                const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
                const name = urlObj.searchParams.get('name') || 'Diagnostic Test User';
                const phone = urlObj.searchParams.get('phone') || '9999999999';
                const amount = Number(urlObj.searchParams.get('amount')) || 199;
                executePay(name, phone, amount);
              } else {
                let body = '';
                req.on('data', chunk => {
                  body += chunk;
                });
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
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
