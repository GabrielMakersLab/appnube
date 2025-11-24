// src/main.tsx
import type { NubeSDK } from "@tiendanube/nube-sdk-types";

export function App(nube: NubeSDK) {
	nube.on("checkout:ready", async ({ location, cart, customer, store }) => {
		if (location.page.type === "checkout" && location.page.data.step === "success") {
			try {
				const coupon = cart.coupon
					? {
							code: cart.coupon.code,
							type: cart.coupon.type,
							value: cart.coupon.value,
					  }
					: null;

				const payload = {
					store_id: store.id,
					store_name: store.name,
					customer,
					cart_id: cart.id,
					total: cart.prices.total,
					currency: store.currency,
					coupon,
				};

				await fetch("https://auto.makerslab.pro/webhook-test/order", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				});

				console.log("Webhook enviado!");
			} catch (err) {
				console.error("Erro ao enviar webhook:", err);
			}
		}
	});
}
