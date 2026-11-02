import { describe, it, expect } from 'vitest';

import { requireApiUrl } from '$lib/utils/requireApiUrl';

describe('requireApiUrl', () => {
	it('returns the url when it is set', () => {
		expect(requireApiUrl('https://api.example.com')).toBe('https://api.example.com');
	});

	it('throws when the url is undefined', () => {
		expect(() => requireApiUrl(undefined)).toThrow('API_URL is not set');
	});

	it('throws when the url is empty', () => {
		expect(() => requireApiUrl('')).toThrow('API_URL is not set');
	});
});
