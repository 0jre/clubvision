import "@/public/Css.Global.css"
import "@/public/tailwind.css"
import {StyledComponentsRegistry} from "@/app/registry"
import { StyleStore } from '@/styles/styled.view'
import { ToastProvider } from "@/shop/ac/toat-shop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {  
 return (
    <html lang="pt-br">
      <head>
        {/* Mova os links de estilo para o head */}
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-brands/css/uicons-brands.css" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.4.2/uicons-brands/css/uicons-brands.css" />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/2.4.0/uicons-bold-rounded/css/uicons-bold-rounded.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/2.6.0/uicons-bold-straight/css/uicons-bold-straight.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-rounded/css/uicons-solid-rounded.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/2.1.0/uicons-solid-rounded/css/uicons-solid-rounded.css"
        />
      </head>
      <body>
         <StyledComponentsRegistry>
          <>
         <StyleStore />
         <ToastProvider>
         {children} 
         </ToastProvider>
     
          </>
         </StyledComponentsRegistry>   
      </body>
    </html>
  )
}




