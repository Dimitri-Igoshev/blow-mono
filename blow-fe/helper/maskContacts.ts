export function maskContacts(text: string, isPremium: boolean): string {
	if (isPremium || !text) return text; // Премиум видит контакты

	// Маскируем телефонные номера
	text = text.replace(/\+?\d[\d\s\-]{7,}\d/g, "######");

	// Маскируем email
	text = text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "######");

	// Маскируем Telegram/WhatsApp (ссылки и @username)
	text = text.replace(/@[\w\d_]{3,}/g, "######"); // @username
	text = text.replace(
		/(t\.me|telegram\.me|wa\.me|whatsapp\.com)\/[A-Za-z0-9_]+/gi,
		"######"
	);

	// Маскируем ссылки (на случай кастомных)
	text = text.replace(/https?:\/\/[^\s]+/gi, "######");

	return text;
}
