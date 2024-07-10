import {tableSchema} from '@nozbe/watermelondb';
import {schemaNames} from '../strings';

const NewsArticleSchema = tableSchema({
  name: schemaNames.NEWS_ARTICLES,
  columns: [
    {name: 'source_id', type: 'string', isOptional: true},
    {name: 'source_name', type: 'string'},
    {name: 'author', type: 'string', isOptional: true},
    {name: 'title', type: 'string'},
    {name: 'description', type: 'string', isOptional: true},
    {name: 'url', type: 'string'},
    {name: 'url_to_image', type: 'string', isOptional: true},
    {name: 'published_at', type: 'string'},
    {name: 'content', type: 'string', isOptional: true},
    {name: 'is_pinned', type: 'boolean', isOptional: true},
  ],
});

export default NewsArticleSchema;
