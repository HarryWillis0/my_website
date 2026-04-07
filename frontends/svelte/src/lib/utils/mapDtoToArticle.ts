import type { IArticleDto, IArticle } from '$lib/types';

export function mapDtoToArticle(dto: IArticleDto): IArticle {
	const created = new Date(dto.created);
	const lastModifiedAt = new Date(dto.lastModifiedAt);

	if (isNaN(created.getTime()) || isNaN(lastModifiedAt.getTime())) {
		throw new Error(`Invalid date in article ${dto.id}`);
	}

	return {
		...dto,
		created,
		lastModifiedAt
	};
}
