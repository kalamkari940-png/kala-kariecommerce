export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout({
  key,
  amount,
  currency = "INR",
  name = "Kalamkari",
  description = "Couture Purchase",
  orderId,
  prefill = {},
  onSuccess,
  onDismiss
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error("Razorpay SDK failed to load. Check your network connection.");
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: key || import.meta.env.VITE_RAZORPAY_KEY_ID || "",
      amount: amount.toString(), // amount in paise (e.g. 100 paise = 1 INR)
      currency,
      name,
      description,
      order_id: orderId,
      prefill: {
        name: prefill.name || "",
        email: prefill.email || "",
        contact: prefill.contact || "",
      },
      theme: {
        color: "#324e4a", // primary luxury brand color
      },
      handler: function (response) {
        if (onSuccess) onSuccess(response);
        resolve(response);
      },
      modal: {
        ondismiss: function () {
          if (onDismiss) onDismiss();
          reject(new Error("Payment was cancelled."));
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  });
}
