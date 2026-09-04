export interface IArticleDto {
	id: string;
	title: string;
	summary: string;
	body: string;
	created: string;
	lastModifiedAt: string;
}

export interface IRoutePointDto {
	lat: number;
	lon: number;
	ele: number;
	distance: number;
}

export interface IRouteDto {
	points: IRoutePointDto[];
	distance: number;
	elevationGain: number;
}

// Envelope returned by GET /articles/{id} — route is an explicit null when
// the article has no route or its GPX failed to parse.
export interface IArticleDetailDto {
	article: IArticleDto;
	route: IRouteDto | null;
}
