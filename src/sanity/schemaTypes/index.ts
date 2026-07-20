import { articleType } from './article';
import { newsType } from './news';
import { commentType } from './comment';
import { calendarEventType } from './calendarEvent';
import { eventVoteType } from './eventVote';
import { emailSubscriberType } from './emailSubscriber';
import { authorType } from './author';
import { homeSettingsType } from './homeSettings';
import { quoteBlockType } from './quoteBlock';
import { youtubeEmbedType } from './youtubeEmbed';
import { tweetEmbedType } from './tweetEmbed';
import { sidebarBannerType } from './sidebarBanner';

export const schemaTypes = [
  authorType, articleType, newsType, commentType, calendarEventType, eventVoteType,
  emailSubscriberType, homeSettingsType, quoteBlockType, youtubeEmbedType, tweetEmbedType,
  sidebarBannerType,
];
