import { getHeroImages } from '@/lib/hero';
import HeroAdminClient from './HeroAdminClient';

export const dynamic = 'force-dynamic';

export default async function HeroAdminPage() {
  const urls = await getHeroImages();
  return <HeroAdminClient initialUrls={urls} />;
}
