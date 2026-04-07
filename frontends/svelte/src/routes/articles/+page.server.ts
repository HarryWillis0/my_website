import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { IArticleService } from '$lib/services/IArticleService';
import { FileArticleService } from '$lib/services/FileArticleService';

export const load: PageServerLoad = async () => {
	try {
		const articleService: IArticleService = new FileArticleService();
		const articles = await articleService.getArticles();

		return {
			articles
		};
	} catch {
		error(500, 'Failed to load articles');
	}
};
