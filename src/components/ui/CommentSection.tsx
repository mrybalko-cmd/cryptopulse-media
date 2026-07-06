'use client';

import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, CornerDownRight, Loader2 } from 'lucide-react';
import type { SanityComment } from '@/lib/sanity';

interface Props {
  targetId: string;
  locale: string;
  initialComments?: SanityComment[];
}

interface PendingComment {
  _id: string;
  authorName: string;
  text: string;
  createdAt: string;
  parentId: string | null;
  pending: true;
}

function initials(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || '?';
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CommentForm({
  locale,
  onSubmit,
  placeholder,
  compact,
  onCancel,
}: {
  locale: string;
  onSubmit: (name: string, text: string) => Promise<{ ok: boolean; message?: string }>;
  placeholder: string;
  compact?: boolean;
  onCancel?: () => void;
}) {
  const isRu = locale === 'ru';
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem('cp_comment_name');
    if (saved) setName(saved);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) return; // bots only
    if (!name.trim() || !text.trim()) return;

    setStatus('sending');
    setErrorMessage('');
    window.localStorage.setItem('cp_comment_name', name.trim());

    const result = await onSubmit(name.trim(), text.trim());
    if (result.ok) {
      setText('');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 4000);
    } else {
      setStatus('error');
      setErrorMessage(result.message || (isRu ? 'Не удалось отправить комментарий.' : "Couldn't submit the comment."));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? 'mt-3' : ''}>
      <div className={compact ? 'flex flex-col gap-2' : 'flex flex-col sm:flex-row gap-2'}>
        {!compact && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isRu ? 'Твоё имя' : 'Your name'}
            maxLength={60}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-accent/50 sm:w-48"
          />
        )}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          maxLength={2000}
          rows={compact ? 2 : 3}
          className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-accent/50 resize-none"
        />
      </div>
      {compact && (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isRu ? 'Твоё имя' : 'Your name'}
          maxLength={60}
          className="mt-2 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-accent/50 w-48"
        />
      )}

      {/* Honeypot — hidden from real users, bots tend to fill every field */}
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute opacity-0 -z-10 w-0 h-0"
      />

      <div className="flex items-center gap-3 mt-2">
        <button
          type="submit"
          disabled={status === 'sending' || !name.trim() || !text.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-background text-xs font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {status === 'sending' && <Loader2 size={12} className="animate-spin" />}
          {isRu ? 'Отправить' : 'Post'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-xs text-muted hover:text-foreground transition-colors">
            {isRu ? 'Отмена' : 'Cancel'}
          </button>
        )}
        {status === 'success' && (
          <span className="text-xs text-positive">
            {isRu ? 'Спасибо! Комментарий появится после проверки.' : 'Thanks! Your comment will appear after review.'}
          </span>
        )}
        {status === 'error' && <span className="text-xs text-negative">{errorMessage}</span>}
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  locale,
  pending,
  replies,
  onReply,
  replyingTo,
  setReplyingTo,
  postReply,
}: {
  comment: SanityComment | PendingComment;
  locale: string;
  pending?: boolean;
  replies: (SanityComment | PendingComment)[];
  onReply: () => void;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  postReply: (parentId: string, name: string, text: string) => Promise<{ ok: boolean; message?: string }>;
}) {
  const isRu = locale === 'ru';
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center text-xs font-bold shrink-0">
        {initials(comment.authorName)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">{comment.authorName}</span>
          <span className="text-xs text-muted">{formatDate(comment.createdAt, locale)}</span>
          {pending && (
            <span className="text-xs text-accent border border-accent/30 rounded-full px-2 py-0.5">
              {isRu ? 'на модерации' : 'pending review'}
            </span>
          )}
        </div>
        <p className="text-sm text-muted mt-1 leading-relaxed whitespace-pre-wrap break-words">{comment.text}</p>

        {!pending && (
          <button
            onClick={onReply}
            className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors mt-1.5"
          >
            <CornerDownRight size={12} />
            {isRu ? 'Ответить' : 'Reply'}
          </button>
        )}

        {replyingTo === comment._id && (
          <CommentForm
            locale={locale}
            compact
            placeholder={isRu ? 'Твой ответ...' : 'Your reply...'}
            onCancel={() => setReplyingTo(null)}
            onSubmit={(name, text) => postReply(comment._id, name, text)}
          />
        )}

        {replies.length > 0 && (
          <div className="flex flex-col gap-4 mt-4 pl-4 border-l border-border">
            {replies.map((reply) => (
              <div key={reply._id} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-accent/15 text-accent flex items-center justify-center text-xs font-bold shrink-0">
                  {initials(reply.authorName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{reply.authorName}</span>
                    <span className="text-xs text-muted">{formatDate(reply.createdAt, locale)}</span>
                    {(reply as PendingComment).pending === true && (
                      <span className="text-xs text-accent border border-accent/30 rounded-full px-2 py-0.5">
                        {isRu ? 'на модерации' : 'pending review'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted mt-1 leading-relaxed whitespace-pre-wrap break-words">{reply.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommentSection({ targetId, locale, initialComments = [] }: Props) {
  const isRu = locale === 'ru';
  const [serverComments, setServerComments] = useState<SanityComment[]>(initialComments);
  const [pendingComments, setPendingComments] = useState<PendingComment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/comments?targetId=${encodeURIComponent(targetId)}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: SanityComment[]) => setServerComments(data))
      .catch(() => {});
  }, [targetId]);

  const allComments = useMemo(
    () => [...serverComments, ...pendingComments],
    [serverComments, pendingComments]
  );

  const topLevel = allComments.filter((c) => !c.parentId);
  const repliesOf = (id: string) => allComments.filter((c) => c.parentId === id);

  const submitComment = async (name: string, text: string, parentCommentId?: string) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: name, text, targetId, parentCommentId, locale }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, message: data.message };

      setPendingComments((prev) => [
        ...prev,
        {
          _id: `pending-${Date.now()}`,
          authorName: name,
          text,
          createdAt: new Date().toISOString(),
          parentId: parentCommentId || null,
          pending: true,
        },
      ]);
      if (parentCommentId) setReplyingTo(null);
      return { ok: true };
    } catch {
      return { ok: false };
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="flex items-center gap-2 text-base font-bold text-foreground mb-6">
        <MessageCircle size={16} className="text-accent" />
        {isRu ? `Комментарии (${allComments.length})` : `Comments (${allComments.length})`}
      </h2>

      <div className="mb-8">
        <CommentForm
          locale={locale}
          placeholder={isRu ? 'Поделись мнением...' : 'Share your thoughts...'}
          onSubmit={(name, text) => submitComment(name, text)}
        />
      </div>

      {topLevel.length > 0 ? (
        <div className="flex flex-col gap-6">
          {topLevel.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              locale={locale}
              pending={(comment as PendingComment).pending === true}
              replies={repliesOf(comment._id)}
              onReply={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              postReply={(parentId, name, text) => submitComment(name, text, parentId)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">
          {isRu ? 'Пока нет комментариев — будь первым!' : 'No comments yet — be the first!'}
        </p>
      )}
    </section>
  );
}
