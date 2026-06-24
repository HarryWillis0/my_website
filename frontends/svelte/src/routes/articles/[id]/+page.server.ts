import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { ApiArticleService } from '$lib/services/ApiArticleService';
import type { IArticle } from '$lib/types/article';

export const load: PageServerLoad<{ article: IArticle | null; viewCount: number }> = async ({
	params
}) => {
	try {
		const articleService = new ApiArticleService(env.API_URL);
		const [article, , viewCountRes] = await Promise.all([
			articleService.getArticleById(params.id),
			fetch(`${env.API_URL}/articles/${params.id}/views`, { method: 'POST' }),
			fetch(`${env.API_URL}/articles/${params.id}/views`)
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
