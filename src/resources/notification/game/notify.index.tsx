import React, { useState } from "react";
import styled from "styled-components";

interface UserNotifyProssInfo {
   Children: React.ReactNode;
}

export default function NotifyView (
    {Children } : UserNotifyProssInfo) {
        return (
          <>
            <ContentAboutLi> 
               {Children}
            </ContentAboutLi>
         </> 
       );
      }

/// NOTIFY CONTENT




/// Style

const ContentAboutLi = styled.div`
      
    height: 100%;
    overflow-y: auto;
`;