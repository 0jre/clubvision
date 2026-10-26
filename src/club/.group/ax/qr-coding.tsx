'use client';
import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import QRCodeStyling from 'qr-code-styling';

interface Info {
    invite: string;
    logo: string;
    width: number, 
    type?: string;
    height: number
}


export default function Qrcode_novision ({invite, logo, width, height, type} : Info) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<QRCodeStyling | null>(null);

  const [data] = useState(`${invite}`);
 
  useEffect(() => {
    if (typeof window === "undefined") return;

    const qrCode = new QRCodeStyling({
      type: "canvas",
      width: width,
      height: height,
      data: data,
      margin: 0,
    
      qrOptions: {
        typeNumber: 4,
        mode: "Byte",
        errorCorrectionLevel: "L",
      },
      imageOptions: {
        saveAsBlob: true,
        hideBackgroundDots: true,
        imageSize: 1,
        margin: 2,
        crossOrigin: "anonymous",
      },
 
      dotsOptions: {
        type: "rounded",
        color: "#49d04b",
        roundSize: true,
        gradient: {
          type: "radial",
          rotation: 0.9806784082777886,
          colorStops: [
            { offset: 0, color: "#5ed65c" },
            { offset: 1, color: "#527b47" },
          ],
        },
      },
      backgroundOptions: {
        color: "#0a0a0a",
        gradient: {
          type: "linear",
          rotation: 0,
          colorStops: [
            { offset: 0, color: "#050505" },
            { offset: 1, color: "#000000" },
          ],
        },
      },
      cornersSquareOptions: {
        type: "dot",
        color: "#51cf81",
        gradient: {
          type: "radial",
          rotation: 0.84434609527920614,
          colorStops: [
            { offset: 0, color: "#61cf74" },
            { offset: 1, color: "#61cf74" },
          ],
        },
      },
      cornersDotOptions: {
        type: "dot",
        color: "#61cf74",
      },
    });

    qrInstance.current = qrCode;

    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qrCode.append(qrRef.current);
    }
 
  }, [logo,invite,height,width]);

  useEffect(() => {
    qrInstance.current?.update({ data });
  }, [data]);

  
  
  
  return (
    <>
      <div className="relative" style={{ width, height }}>
      <div ref={qrRef} className="w-full h-full" />
      <img
        src={logo}
        alt="logo"
        className="absolute rounded-full"
        style={{
          width: width * 0.2,
          height: height * 0.2,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          background: 'black',
          border: '3px solid black', // opcional: borda branca como a Uniswap
        }}
      />
    </div>
    </>
  ) 

}
 