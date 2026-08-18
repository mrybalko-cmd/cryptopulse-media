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
import { facebookEmbedType } from './facebookEmbed';
import { sidebarBannerType } from './sidebarBanner';
import { coinQuotesType } from './coinQuotes';
import { marketSnapshotType } from './marketSnapshot';
import { exchangeType } from './exchange';
import { exchangeReviewType } from './exchangeReview';
import { adminUserType } from './adminUser';
import { adminActivityLogType } from './adminActivityLog';
import { regulationCountryType } from './regulationCountry';

export const schemaTypes = [
  authorType, articleType, newsType, commentType, calendarEventType, eventVoteType,
  emailSubscriberType, homeSettingsType, quoteBlockType, youtubeEmbedType, tweetEmbedType, facebookEmbedType,
  sidebarBannerType, marketSnapshotType,
    coinQuotesType, exchangeType, exchangeReviewType, adminUserType, adminActivityLogType,
  regulationCountryType,
];
