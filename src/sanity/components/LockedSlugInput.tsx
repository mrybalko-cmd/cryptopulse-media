import { useState } from 'react';
import { Button, Flex, Stack, Text } from '@sanity/ui';
import { LockIcon, UnlockIcon } from '@sanity/icons';
import { useEditState, useFormValue, type SlugInputProps } from 'sanity';

// Regenerating/editing the slug on an already-published item changes the
// real live URL with no redirect from the old one — breaking whatever
// already links to or has indexed it (Google, other articles, social
// shares). This locks the field once a published version of the document
// exists, requiring an explicit "Unlock" click to override.
export function LockedSlugInput(props: SlugInputProps) {
  const documentId = useFormValue(['_id']) as string | undefined;
  const documentType = useFormValue(['_type']) as string | undefined;
  const baseId = documentId?.replace(/^drafts\./, '') ?? '';
  const { published, ready } = useEditState(baseId, documentType ?? '');
  const hasPublished = ready && Boolean(published);
  const [unlocked, setUnlocked] = useState(false);
  const locked = hasPublished && !unlocked;

  return (
    <Stack space={2}>
      {props.renderDefault({ ...props, readOnly: props.readOnly || locked })}
      {hasPublished && (
        <Flex align="center" gap={2}>
          <Text size={1} muted>
            {locked
              ? 'Материал уже опубликован — slug заблокирован, чтобы не сломать текущий URL (редиректа со старого адреса нет).'
              : 'Разблокировано — меняйте, только если осознанно готовы, что старый URL перестанет работать.'}
          </Text>
          <Button
            mode="bleed"
            tone={locked ? 'caution' : 'positive'}
            icon={locked ? UnlockIcon : LockIcon}
            text={locked ? 'Разблокировать' : 'Заблокировать снова'}
            onClick={() => setUnlocked(v => !v)}
          />
        </Flex>
      )}
    </Stack>
  );
}
