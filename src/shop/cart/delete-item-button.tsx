'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { BasketPackage } from '@/types/user/types.tebex';
import clsx from 'clsx';
import LoadingDots from '@club/shop/ac/loading-dots';
import { removeItem } from '@/lib/oauth/tebex/actions';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  const handleClick = (e: React.FormEvent<HTMLButtonElement>) => {
    if (pending) {
      e.preventDefault();
    } null;
  };

  return (
    <button
      type="submit"
      onClick={handleClick}
      data-update-basket="true"
      aria-label="Remove cart item"
      aria-disabled={pending}
      className={clsx(
        'ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200',
        {
          'cursor-not-allowed px-0': pending
        }
      )}
    >
      {pending ? (
        <LoadingDots className="bg-white" />
      ) : (
        <XMarkIcon className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white dark:text-black" />
      )}
    </button>
  );
}

export function DeleteItemButton({ item }: { item: BasketPackage }) {
  const [message, formAction] = useFormState(removeItem, null);
  const itemId = item.id;
  const actionWithVariant = formAction.bind(null, itemId.toString());

  return (
    <form 
    action={actionWithVariant}
    
    >
      <SubmitButton />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
