'use client';

import { createUrl } from '@/lib/oauth/tebex/utils';
import clsx from 'clsx';
import Link from 'next/link';
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { PathFilterItem } from '.';
import ROUTENVX from '@/routes/routes';

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  let newParams: ReadonlyURLSearchParams | URLSearchParams | null = null;

  if (searchParams) {
    newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('q');
  }

  const DynamicTag = active ? 'div' : Link;

  return (
    <>

    <li className="mt-2 flex flex-col dark:text-white click" onClick={() => router.push(ROUTENVX.storeclub)}>
    <h4>SHOPCLUB</h4>
    </li>

    <li className="mt-2 flex flex-col align-center justify-center    dark:text-white" key={item.title}>
    <DynamicTag 
    href={createUrl(item.path, newParams as ReadonlyURLSearchParams | URLSearchParams)}
    className={clsx('',{'active2': active})}>
        <h4 className='hover:text-white '>{item.title}</h4> 
    </DynamicTag>
    <div className={clsx('text-center ml-8',{'active': active})}>
      </div>
    </li>
    </>
  );
}

export function FilterItem({ item }: { item: PathFilterItem }) {
  return <PathFilterItem item={item} />;
}
