 
import { AdminLayout } from "@/admin/components/admin-layout"
import { SecurityAudit } from "@/admin/components/security-audit"


import { User } from "@/types/user/types";
import { useEffect, useState } from 'react';
import React from 'react';
import { Permission, getPermission} from "@/types/discord/permission";
import HeadADM from '@/club/head/head_admin';
import ModalAds from '@/admin/components/ap/ads.modal';

import ViewManagerList from '@/admin/components/ap/open.list';
import AdminConvites from '@/admin/components/ap/admin.invites';
import { useRouter } from 'next/router';
import Statustotal from '@/admin/components/ax/graphic/graphic.pr';
import AdesaoManager from '@/admin/components/ap/manager.adesao';
import Tooladescard from '@/admin/components/ap/adesao.tool';
import CreateCodeComponent from '@/admin/components/ap/createcodebits';
import InfoUser from "@/admin/components/ap/infouser.hov";
import ErrorPage from "@/app/not-found";
import { ContentModeration } from "@/admin/components/content-moderation-integrated";
import { ContentAudit } from "@/admin/components/content-audit-integrated";
import { PostManagement } from "@/admin/components/post-management-integrated";
import { CommentManagement } from "@/admin/components/comment-management-integrated";
import { WalletTransactions } from "@/admin/components/wallet/wallet-transactions";
import { WalletAudit } from "@/admin/components/wallet/wallet-audit";
import { WalletUsers } from "@/admin/components/wallet/wallet-users";
import { WalletOverview } from "@/admin/components/wallet/wallet-overview";
import { StakingOverview } from "@/admin/components/wallet/staking-overview";
import { StakingUsers } from "@/admin/components/wallet/staking-users";
import { StakingValidators } from "@/admin/components/wallet/staking-validators";
import { MarketplaceOverview } from "@/admin/components/wallet/marketplace-overview";
import { MarketplaceCases } from "@/admin/components/wallet/marketplace-case";
import { MarketplaceTransactions } from "@/admin/components/wallet/marketplace-transactions";
import { MarketplaceUpgrades } from "@/admin/components/wallet/marketplace-upgrades";
import { CheckoutOverview } from "@/admin/components/wallet/checkout-overview";
import { CheckoutSessions } from "@/admin/components/wallet/checkout-sessions";
import { CheckoutTransactions } from "@/admin/components/wallet/checkout-transactions";
import { CheckoutAnalytics } from "@/admin/components/wallet/checkout-analystic";
import { MonetizationOverview } from "@/admin/components/wallet/monetization-overview";
import { MonetizationAnalytics } from "@/admin/components/wallet/monetization-analystics";
import { MonetizationCreators } from "@/admin/components/wallet/monetization-creators";
import { MonetizationWithdrawals } from "@/admin/components/wallet/monetization-withdrawals";
import { AdminMainDashboard } from '../components/dashboard';
import {AdminAuditBattlepass} from "../components/admin-battlepass";
import ObservabilityPage from "./observability";



interface Props {
    user: User | null;
    Permissions: Permission[];
  }

export default function DashboardAdministrator ({ user, Permissions }: Props) {
  const router = useRouter();
  const { overview, ...rest } = router.query;
  const [activeSection, setActiveSection] = useState("dashboard");

  const [isAdminAccountVisible, setIsAdminAccountVisible] = useState(false);
  const [isManagerAccountVisible, setIsManagerAccountVisible] = useState(false);

  useEffect(() => {
     const hasPermission = Permissions.some((log) => log.type === 'ADMIN');
       const hasPermissionmanager = Permissions.some((log) => log.manager === true);
     
    setIsAdminAccountVisible(hasPermission);
    setIsManagerAccountVisible(hasPermissionmanager);
  }, [Permissions]);

  useEffect(() => {
    if (router.query.overview) {
      setActiveSection("user-profile");
    }
  }, [router.query]);


  const renderContent = () => {
    switch (activeSection) {
      case "adesao":
      return (
        <>
           <Tooladescard 
              permission={isManagerAccountVisible ? true : false}
              children={
                <>
            
              <AdesaoManager 
  permission={isManagerAccountVisible ? true : false}
/>
                </>
              } />
            
        </>
      );
         
       case "observability": 
       return <ObservabilityPage />
       case "overview-monetization": 
       return <MonetizationOverview />
        case "monetization-analytics": 
       return <MonetizationAnalytics />
        case "monetization-creators": 
       return <MonetizationCreators />
    case "monetization-withdrawals": 
       return <MonetizationWithdrawals />
       case "overview-checkout": 
       return <CheckoutOverview />
       case "checkout-sessions":
        return <CheckoutSessions />
          case "checkout-transactions":
        return <CheckoutTransactions />
          case "checkout-analystic":
        return <CheckoutAnalytics />
       case "overview-marketplace": 
       return <MarketplaceOverview />
       case "marketplace-cases": 
       return <MarketplaceCases />
       case "marketplace-transactions": 
       return <MarketplaceTransactions />
       case "marketplace-upgrades": 
       return <MarketplaceUpgrades />
       case "staking-wallet": 
       return <StakingOverview />
       case "validators-staking": 
       return <StakingValidators />
        case "validators-users": 
       return <StakingUsers />
      case "dashboard":
        return <AdminMainDashboard />;
      case "content":
        return <ContentModeration />;
    
      case "content-audit":
        return <ContentAudit />;
      case "post-management":
        return <PostManagement />;
      case "overview-wallet": 
       return <WalletOverview />
   
        case "audit-wallet": 
       return <WalletAudit />
          case "users-wallet": 
       return <WalletUsers />
       case "transactions-wallet": 
       return <WalletTransactions />
      case "comment-management":
        return <CommentManagement />;
      case "security-audit":
        return <AdminAuditBattlepass />
      case "manager":
        return <ViewManagerList />;
      case "estadisticas":
        return <Statustotal />;
      case "codigobits":
        return <CreateCodeComponent />;
      case "convites":
        return <AdminConvites />;
      case "advertising":
        return <ModalAds />;
      
      case "user-profile":
        return (
          <>
            <InfoUser userId={overview} acessmanager={isManagerAccountVisible} />
          </>
        );
      default:
        return <AdminMainDashboard />;
    }
  };

  return (
    <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <HeadADM />
   
        {renderContent()}
     
    </AdminLayout>
  );
}


 

 
