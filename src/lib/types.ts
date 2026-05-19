import { ISiteSettings } from '@/models/SiteSettings';

export interface IFeaturedArticle {
    title: string;
    desc: string;
    img: string;
    author: string;
    tag: string;
    slug: string;
    url: string;
    isEmpty?: boolean;
}

export type ISiteSettingsParsed = ISiteSettings & {
    featuredArticles?: IFeaturedArticle[];
};
