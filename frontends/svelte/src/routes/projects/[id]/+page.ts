import type { PageLoad } from './$types';
import { projects } from '$lib/data/projects';
import type { IProject } from '$lib/types';

export const load: PageLoad<{ project: IProject | null }> = ({ params }) => {
	const project = projects.find((p) => p.id === params.id) ?? null;

	return { project };
};
