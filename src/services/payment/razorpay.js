/**
 * Client-Side Razorpay Gateway Integration
 * Opens the authentic Razorpay checkout modal and captures customer transaction signatures.
 */

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK from https://checkout.razorpay.com/v1/checkout.js");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Opens Razorpay Checkout Modal
 * Returns Promise<{ razorpay_order_id, razorpay_payment_id, razorpay_signature }>
 */
export async function openRazorpayCheckout({
  key,
  orderId,
  amount,
  currency = "INR",
  name = "Kalamkari Atelier",
  description = "Bespoke Couture Order",
  prefill = {},
  themeColor = "#1c2d27"
} = {}) {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error("Razorpay payment gateway SDK could not be loaded. Please verify your internet connection.");
  }

  if (!key) {
    throw new Error("Razorpay Key ID is missing. Please ensure VITE_RAZORPAY_KEY_ID or server key is configured.");
  }

  return new Promise((resolve, reject) => {
    let paymentCompleted = false;

    const options = {
      key,
      amount: String(amount), // amount in paise
      currency,
      name,
      description,
      order_id: orderId || undefined,
      prefill: {
        name: prefill.name || "",
        email: prefill.email || "",
        contact: prefill.contact || ""
      },
      theme: {
        color: themeColor
      },
      modal: {
        confirm_close: true,
        ondismiss: function () {
          if (!paymentCompleted) {
            reject(new Error("Payment was cancelled. Your shopping bag is intact and no funds were deducted."));
          }
        }
      },
      handler: function (response) {
        paymentCompleted = true;
        if (!response.razorpay_payment_id) {
          reject(new Error("Payment response was missing transaction identifiers from Razorpay."));
          return;
        }
        resolve({
          razorpay_order_id: response.razorpay_order_id || orderId || "",
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature || ""
        });
      }
    };

    try {
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        paymentCompleted = true;
        const errDetail = response.error?.description || response.error?.reason || "Payment was declined by your bank/gateway.";
        reject(new Error(`Payment Failed: ${errDetail}`));
      });

      rzp.open();
    } catch (err) {
      reject(new Error(`Failed to initialize Razorpay checkout: ${err?.message || "Unknown error"}`));
    }
  });
}
