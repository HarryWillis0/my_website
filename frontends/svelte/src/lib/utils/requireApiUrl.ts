export function requireApiUrl(apiUrl: string | undefined): string {
	if (apiUrl) {
		return apiUrl;
	}
	throw new Error('API_URL is not set');
}
