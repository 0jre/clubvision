import React from "react";
import styled from "styled-components";
import NotificationIcon from '@/public/icons/notification.png'
import Image from "next/image";

interface NotificationProps {
   message: React.ReactNode;
   type?: 'success' | 'error' | 'info';
}

export default function NotificationUI ({ message, type = 'info' }: NotificationProps) {
    return(
        <>
        <ViewContainerNotify>
        <Notification $type={type}>
         <Image src={NotificationIcon} alt="notification" height={35} width={35}/>
          <li>
            <p className="fontmam">{message}</p>
          </li>
        </Notification>
        </ViewContainerNotify>
        </>
    )
}



const ViewContainerNotify = styled.section`
    display: grid;
    place-items: center;
    justify-content: center;
    position: fixed;
 z-index: 9999999999;
    left: 0;
    right: 0;
`;


const Notification = styled.div<{$type?: 'success' | 'error' | 'info'}>`

    visibility: hidden;
	border-radius: 25px;
    width: 50px;
    height: 50px;
    margin: auto;
    color: ${({ $type }) =>
    $type === 'success' ? '#27ae60' :
    $type === 'error' ? '#e92c1363' :
    '#fff'};
    text-align: center;
    position: fixed;
    z-index: 1;
    left: 0;right:0;
    bottom: 30px;
    font-size: 17px;
    white-space: nowrap;
    background-color: #0c0c0e;
    padding: 15px 0.6em 15px;
    overflow: hidden;
  	white-space: nowrap;
    font-family: 'Inter', monospace;
    visibility: visible;
    -webkit-animation: fadein 0.5s, expand 0.5s 0.5s,stay 7s 1s, shrink 0.5s 2s, fadeout 0.5s 2.5s;
    animation: fadein 0.5s, expand 0.5s 0.5s,stay 3s 1s, shrink 0.5s 4s, fadeout 0.5s 4.5s;
    display: flex;
    flex-direction: row;
    align-items: center;


@-webkit-keyframes fadein {
    from {bottom: 0; opacity: 0;} 
    to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes expand {
    from {min-width: 50px} 
    to {min-width: 330px}
}

@keyframes expand {
    from {min-width: 50px}
    to {min-width: 330px}
}
@-webkit-keyframes stay {
    from {min-width: 430px} 
    to {min-width: 430px}
}

@keyframes stay {
    from {min-width: 430px}
    to {min-width: 430px}
}
@-webkit-keyframes shrink {
    from {min-width: 430px;} 
    to {min-width: 50px;}
}

@keyframes shrink {
    from {min-width: 430px;} 
    to {min-width: 50px;}
}

@-webkit-keyframes fadeout {
    from {bottom: 30px; opacity: 1;} 
    to {bottom: 60px; opacity: 0;}
}

@keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 60px; opacity: 0;}
}

 h2{
  font-size: 11px;
  color: #d3d3df44;
  margin-bottom: 0;
 }

 i{
  font-size: 21px;
  display: flex;
  align-items: center;
  color: #2e2e33;
 }

.fontmam{
  font-size: 13px;
  color: #9c9da7dc;
}

li{
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-left: 0.9em;
}
`;

 