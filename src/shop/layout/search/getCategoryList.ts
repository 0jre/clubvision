'use server';
import { getCategories } from '@/lib/oauth/tebex';
import { PathFilterItem } from './filter';
import ROUTENVX from '@/routes/routes';

export async function getCategoryList() {
  const categories: PathFilterItem[] = [
    ...(await getCategories(true, (c) => c.packages.length !== 0))
      .sort((a, b) => a.order - b.order)
      .map((c) => {
        return { title: c.name, path: `${ROUTENVX.category}/${c.id}` };
      }),
  ];
  return categories;
}
