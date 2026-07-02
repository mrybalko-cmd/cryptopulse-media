import { articleType } from './article';
import { newsType } from './news';
import { commentType } from './comment';
import { calendarEventType } from './calendarEvent';
import { eventVoteType } from './eventVote';
import { emailSubscriberType } from './emailSubscriber';
import { authorType } from './author';

export const schemaTypes = [authorType, articleType, newsType, commentType, calendarEventType, eventVoteType, emailSubscriberType];
