export interface IProject {
	id: string;
	title: string;
	description: string;
	body: string;
	tags: string[];
	repoUrl: string;
	liveUrl?: string;
}
