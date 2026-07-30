import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';

import ProjectDetail from '$lib/components/project/ProjectDetail.svelte';
import ProjectPage from '../../routes/projects/[id]/+page.svelte';
import type { IProject } from '$lib/types';

const mockProject: IProject = {
	id: 'test-project',
	title: 'Test Project',
	description: 'A short blurb about the project',
	body: 'Some **markdown** body',
	tags: ['Svelte', 'TypeScript'],
	repoUrl: 'https://github.com/harrywillis0/test-project'
};

const mockProjectWithLive: IProject = {
	...mockProject,
	id: 'live-project',
	liveUrl: 'https://live-project.example.com'
};

describe('ProjectDetail', () => {
	it('renders title, description, and tags', () => {
		render(ProjectDetail, { props: { project: mockProject } });
		expect(screen.getByText('Test Project')).toBeInTheDocument();
		expect(screen.getByText('A short blurb about the project')).toBeInTheDocument();
		expect(screen.getByText('Svelte')).toBeInTheDocument();
		expect(screen.getByText('TypeScript')).toBeInTheDocument();
	});

	it('renders the markdown body', () => {
		render(ProjectDetail, { props: { project: mockProject } });
		const strong = screen.getByText('markdown');
		expect(strong.tagName).toBe('STRONG');
	});

	it('renders a Repo link with target=_blank and rel=noopener noreferrer', () => {
		render(ProjectDetail, { props: { project: mockProject } });
		const link = screen.getByRole('link', { name: 'Repo' });
		expect(link).toHaveAttribute('href', mockProject.repoUrl);
		expect(link).toHaveAttribute('target', '_blank');
		expect(link.getAttribute('rel')?.split(/\s+/)).toEqual(
			expect.arrayContaining(['noopener', 'noreferrer'])
		);
	});

	it('does not render a Live link when liveUrl is absent', () => {
		render(ProjectDetail, { props: { project: mockProject } });
		expect(screen.queryByRole('link', { name: 'Live' })).not.toBeInTheDocument();
	});

	it('renders a Live link with target=_blank and rel=noopener noreferrer when liveUrl is present', () => {
		render(ProjectDetail, { props: { project: mockProjectWithLive } });
		const link = screen.getByRole('link', { name: 'Live' });
		expect(link).toHaveAttribute('href', mockProjectWithLive.liveUrl);
		expect(link).toHaveAttribute('target', '_blank');
		expect(link.getAttribute('rel')?.split(/\s+/)).toEqual(
			expect.arrayContaining(['noopener', 'noreferrer'])
		);
	});
});

describe('/projects/[id] page', () => {
	it('renders ProjectDetail when the project is found', () => {
		render(ProjectPage, { props: { data: { project: mockProject } } });
		expect(screen.getByText('Test Project')).toBeInTheDocument();
	});

	it('shows an inline not-found message when the project is missing', () => {
		render(ProjectPage, { props: { data: { project: null } } });
		expect(screen.getByText('Project not found')).toBeInTheDocument();
	});

	it('links back to /projects from the not-found state', () => {
		render(ProjectPage, { props: { data: { project: null } } });
		const link = screen.getByRole('link', { name: /all projects/i });
		expect(link).toHaveAttribute('href', '/projects');
	});
});
