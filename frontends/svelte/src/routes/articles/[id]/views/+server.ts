import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params }) => {
	await fetch(`${env.API_URL}/articles/${params.id}/views`, { method: 'POST' });
	return new Response(null, { status: 204 });
};
