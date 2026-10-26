
import React from 'react'
import { TrivoStyle } from '../../../../styles/Globalstyleview';
import AccountNvxre from '../../../../components/account/account.user';
import { HeaderSection } from '../../../../.trivo/components/header';


interface Props {
    children: React.ReactNode;
}
export const TrivoLayoutPage: React.FC<Props> = React.memo (({children}) => {
    return (
 <div className="scrollbar-none selection-none">

         <TrivoStyle />
             <AccountNvxre 
              market={true}
              balance={true}
             navbar='relative' 
             nav={
                  <HeaderSection />
             } />

            {children}

 
        </div>
    )
})
