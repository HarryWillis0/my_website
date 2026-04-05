export interface IArticle {
    id: string;
    title: string;
    summary: string;
    body: string; // markdown format
    created: Date;
    lastModifiedAt: Date;
}