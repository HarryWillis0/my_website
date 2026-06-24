import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { ApiArticleService } from '$lib/services/ApiArticleService';
import type { IArticle } from '$lib/types/article';

export const load: PageServerLoad<{ article: IArticle | null }> = async ({ params }) => {
	try {
		const articleService = new ApiArticleService(env.API_URL);
		const article = await articleService.getArticleById(params.id);

		return {
			article
		};
	} catch {
		error(500, 'Failed to load article');
	}
};
