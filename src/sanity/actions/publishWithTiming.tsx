import { PublishIcon } from '@sanity/icons';
import { useDocumentOperation } from 'sanity';
import type { DocumentActionComponent, DocumentActionProps } from 'sanity';

// Replaces the default "Publish" action for article/news so that picking
// "Now" in the publishTiming field stamps publishedAt with the actual moment
// Publish is clicked (not whenever the draft happened to be created). Only
// applies on the very first publish — re-publishing an edit never moves the
// original publish date, regardless of publishTiming.
export const publishWithTimingAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const draft = props.draft as (Record<string, unknown> & { publishTiming?: string }) | null;
  const isFirstPublish = !props.published;

  return {
    label: 'Publish',
    icon: PublishIcon,
    disabled: !draft || !!publish.disabled,
    onHandle: () => {
      const timing = draft?.publishTiming;
      if (isFirstPublish && timing !== 'scheduled') {
        patch.execute([{ set: { publishedAt: new Date().toISOString() } }]);
      }
      publish.execute();
      props.onComplete();
    },
  };
};

publishWithTimingAction.action = 'publish';
