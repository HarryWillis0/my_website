import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { ApiArticleService } from '$lib/services/ApiArticleService';
import { requireApiUrl } from '$lib/utils/requireApiUrl';

export const load: PageServerLoad = async () => {
	try {
		const articleService = new ApiArticleService(requireApiUrl(env.API_URL));
		const articles = await articleService.getArticles();

		return {
			articles
		};
	} catch (e) {
		console.error('Failed to load articles:', e);
		error(500, 'Failed to load articles');
	}
};
