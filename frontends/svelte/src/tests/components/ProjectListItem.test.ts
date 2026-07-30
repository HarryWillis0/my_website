import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';

import ProjectListItem from '$lib/components/project/ProjectListItem.svelte';
import type { IProject } from '$lib/types';

const mockProject: IProject = {
	id: 'test-project',
	title: 'Test Project',
	description: 'A short blurb about the project',
	body: 'Full write-up body',
	tags: ['Svelte', 'TypeScript'],
	repoUrl: 'https://github.com/harrywillis0/test-project'
};

describe('ProjectListItem', () => {
	it('renders project title and description', () => {
		render(ProjectListItem, { props: { project: mockProject } });
		expect(screen.getByText('Test Project')).toBeInTheDocument();
		expect(screen.getByText('A short blurb about the project')).toBeInTheDocument();
	});

	it('renders each tag', () => {
		render(ProjectListItem, { props: { project: mockProject } });
		expect(screen.getByText('Svelte')).toBeInTheDocument();
		expect(screen.getByText('TypeScript')).toBeInTheDocument();
	});

	it('links to the correct project page', () => {
		render(ProjectListItem, { props: { project: mockProject } });
		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/projects/test-project');
	});

	it('renders no nested links', () => {
		render(ProjectListItem, { props: { project: mockProject } });
		const links = screen.getAllByRole('link');
		expect(links).toHaveLength(1);
	});
});
