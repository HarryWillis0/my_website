import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { ApiArticleService } from '$lib/services/ApiArticleService';
import type { IArticle } from '$lib/types/article';
import { requireApiUrl } from '$lib/utils/requireApiUrl';

export const load: PageServerLoad<{ article: IArticle | null; viewCount: number }> = async ({
	params
}) => {
	try {
		const apiUrl = requireApiUrl(env.API_URL);
		const articleService = new ApiArticleService(apiUrl);
		const [article, viewCountRes] = await Promise.all([
			articleService.getArticleById(params.id),
			fetch(`${apiUrl}/articles/${params.id}/views`)
		]);

		if (!viewCountRes.ok) {
			console.warn(`View count API returned ${viewCountRes.status} for article ${params.id}`);
		}

		const viewCount: number = viewCountRes.ok
			? ((await viewCountRes.json()) as { viewCount: number }).viewCount
			: 0;

		return { article, viewCount };
	} catch (e) {
		console.error('Failed to load article:', e);
		error(500, 'Failed to load article');
	}
};
