export interface IRoutePoint {
	lat: number;
	lon: number;
	ele: number;
	distance: number;
}

export interface IRoute {
	points: IRoutePoint[];
	distance: number;
	elevationGain: number;
}

export interface IArticle {
	id: string;
	title: string;
	summary: string;
	body: string;
	created: Date;
	lastModifiedAt: Date;
	route?: IRoute;
}
