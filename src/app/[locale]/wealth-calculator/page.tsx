import { permanentRedirect } from 'next/navigation';

type Props = { params: Promise<{ locale: string }> };

export default async function WealthCalculatorRedirect({ params }: Props) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/calculators/wealth`);
}
