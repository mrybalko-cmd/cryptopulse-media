import { BASE } from '@/lib/metadata';
import { SITE_NAME } from '@/lib/site';
import { authorName } from '@/lib/authorName';

type A = {
  name: string;
  firstNameRu?: string; lastNameRu?: string;
  firstNameEn?: string; lastNameEn?: string;
  roleRu?: string; roleEn?: string;
  bioRu?: string; bioEn?: string;
  photo?: string;
  entityKind?: 'person' | 'organization';
  sponsored?: boolean;
  telegram?: string; linkedin?: string; facebook?: string;
  twitter?: string; instagram?: string; website?: string;
};

/**
 * Разметка страницы участника.
 *
 * Человек уходит как Person, компания как Organization. Подменять одно другим
 * нельзя: у организации нет должности, а у человека нет логотипа, и Google
 * выбрасывает такой элемент целиком, а не правит его за нас.
 *
 * worksFor ставится только своим. Платное размещение в редакции не работает,
 * и написать обратное значит соврать поисковику про состав издания.
 */
export function authorJsonLd(author: A, locale: string, slug: string, isRu: boolean) {
  const isOrg = author.entityKind === 'organization';
  const url = `${BASE}/${locale}/authors/${slug}`;
  const bio = (isRu ? author.bioRu : author.bioEn) || (isRu ? author.bioEn : author.bioRu);
  const role = (isRu ? author.roleRu : author.roleEn) || (isRu ? author.roleEn : author.roleRu);

  const sameAs = [
    author.website, author.linkedin, author.twitter,
    author.facebook, author.instagram, author.telegram,
  ].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': isOrg ? 'Organization' : 'Person',
    name: authorName(author, locale),
    url,
    ...(author.photo ? (isOrg ? { logo: author.photo, image: author.photo } : { image: author.photo }) : {}),
    ...(bio ? { description: bio } : {}),
    ...(!isOrg && role ? { jobTitle: role } : {}),
    ...(!isOrg && !author.sponsored
      ? { worksFor: { '@type': 'Organization', name: SITE_NAME, url: BASE } }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
    mainEntityOfPage: { '@type': 'ProfilePage', '@id': url },
  };
}
