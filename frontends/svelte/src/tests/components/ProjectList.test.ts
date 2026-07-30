import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';

import ProjectList from '$lib/components/project/ProjectList.svelte';
import type { IProject } from '$lib/types';

const mockProjects: IProject[] = [
	{
		id: 'first-project',
		title: 'First Project',
		description: 'First description',
		body: 'First body',
		tags: ['Go'],
		repoUrl: 'https://github.com/harrywillis0/first-project'
	},
	{
		id: 'second-project',
		title: 'Second Project',
		description: 'Second description',
		body: 'Second body',
		tags: ['React'],
		repoUrl: 'https://github.com/harrywillis0/second-project',
		liveUrl: 'https://second-project.example.com'
	}
];

describe('ProjectList', () => {
	it('renders empty state when no projects', () => {
		render(ProjectList, { props: { projects: [] } });

		expect(screen.getByText('No projects yet — check back soon.')).toBeInTheDocument();
	});

	it('renders a list when projects are provided', () => {
		render(ProjectList, { props: { projects: mockProjects } });

		expect(screen.getByText('First Project')).toBeInTheDocument();
		expect(screen.getByText('Second Project')).toBeInTheDocument();
	});

	it('renders the correct number of projects', () => {
		render(ProjectList, { props: { projects: mockProjects } });

		const links = screen.getAllByRole('link');
		const filteredLinks = links.filter((link) => link.getAttribute('href')?.includes('/projects/'));

		expect(filteredLinks).toHaveLength(mockProjects.length);
	});

	it('renders footer when projects are present', () => {
		render(ProjectList, { props: { projects: mockProjects } });

		expect(screen.getByLabelText('Footer')).toBeInTheDocument();
	});
});
