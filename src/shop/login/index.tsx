

'use client'
import { useAuthUrl, useBasket } from '@/hooks/useTebex';
import LoginModal from './modal';

export default function Login() {
  const basket = useBasket();
  const authUrl = useAuthUrl(basket);

  return <LoginModal authLink={authUrl} basket={basket} />;
}
