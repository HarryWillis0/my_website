import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import type { IArticleService } from '$lib/services/IArticleService';
import { FileArticleService } from '$lib/services/FileArticleService';
import type { IArticle } from '$lib/types/article';

export const load: PageServerLoad<{ article: IArticle | null }> = async ({ params }) => {
	try {
		const articleService: IArticleService = new FileArticleService();
		const article = await articleService.getArticleById(params.id);

		return {
			article
		};
	} catch {
		error(500, 'Failed to load article');
	}
};
