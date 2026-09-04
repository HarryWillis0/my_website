import type { IArticleDto, IArticle, IRouteDto } from '$lib/types';

export function mapDtoToArticle(dto: IArticleDto, route?: IRouteDto | null): IArticle {
	const created = new Date(dto.created);
	const lastModifiedAt = new Date(dto.lastModifiedAt);

	if (isNaN(created.getTime()) || isNaN(lastModifiedAt.getTime())) {
		throw new Error(`Invalid date in article ${dto.id}`);
	}

	return {
		...dto,
		created,
		lastModifiedAt,
		route: route ?? undefined
	};
}
