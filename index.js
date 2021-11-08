const { chromium } = require("playwright")

const shops = [
	{
		vendor: "Microsoft",
		url: "https://www.xbox.com/es-ES/configure/8WJ714N3RBTL",
		checkStock: async ({ page }) => {
			const content = await page.textContent('[aria-label="Finalizar la compra del pack"]')

			return content.includes("Sin existencias") === false
		},
	},
	{
		vendor: "Amazon",
		url: "https://www.amazon.com/-/es/Xbox-Consola-controlador-inal%C3%A1mbrico-alimentaci%C3%B3n/dp/B087VM5XC6",
		checkStock: async ({ page }) => {
			const content = await page.textContent(".a-color-price")
			return content.includes("No disponible por el momento.") === false
		},
	},
]

;(async () => {
	const browser = await chromium.launch({ headless: false })

	for (const shop of shops) {
		const { checkStock, vendor, url } = shop

		const page = await browser.newPage()
		await page.goto(url)

		const hasStock = await checkStock({ page })

		await page.screenshot({ path: `screenshops/${vendor}.png` })
	}

	await browser.close()
})()
