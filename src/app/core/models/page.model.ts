export interface PageDto {
  id?: string | number;
  title?: string;
  slug?: string;
  content?: any;
  featuredImage?: string;
  authorId?: string;
  publishDate?: Date;
  isPublished?: boolean;
  tags?: string[];
  parentId?: string;
  headerId?: string;
  articleFilter?: 0 | 1 | 2 | 3 | 4;
  filterValue?: string;
  components?: string[];
  metaDescription?: string;
  metaTitle?: string;
  ogImage?: string;
  canonical?: string;
  robots?: string;
  focusKeyphrase?: string;
  canonicalUrl?: string;
  metaRobotsIndex?: string;
  metaRobotsFollow?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  excludeFromSitemap?: boolean;
}

export interface PageListItem {
  id?: string | number;
  title?: string;
  slug?: string;
  author?: string;
  publishDate?: Date;
  isPublished?: boolean;
}
