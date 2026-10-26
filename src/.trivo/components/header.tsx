import React, { useEffect, useState } from "react";
import { Button } from "../items/button";
import { Card, CardContent } from "../items/card";
import { ScrollArea, ScrollBar } from "../items/scroll-area";
import { skinCards } from "@/data/market/header";
import { containerItems, Item } from "@/data/list_tvl/list.container";
import { AnimatePresence, motion } from 'framer-motion';
import TypeRaritity from "../items/type-rarity";
import styled from "styled-components";
import router from 'next/router';
import ROUTENVX from "@/routes/routes";
 
export const HeaderSection = () => {
  const [visibleItems, setVisibleItems] = useState<Item[]>([]);
  const allItems: Item[] = Object.values(containerItems).flat();
  const [isAllShown, setIsAllShown] = useState(false);
  const [dropMode] = useState<"limitar" | "circular">("circular");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const StartInterval = Math.random() * 4000 + 1000;

  const shuffleArray = (array: Item[]): Item[] => array.sort(() => Math.random() - 0.5);

  useEffect(() => {
    let i = 0;
    let shuffledItems = shuffleArray(allItems);

    const interval = setInterval(() => {
      if (i >= shuffledItems.length) {
        shuffledItems = shuffleArray(allItems);
        i = 0;
      }

      const itemsToShow = shuffledItems.slice(i, i + Math.floor(Math.random() * 8) + 1);
      itemsToShow.forEach((item) => handleDrop(item));
      i += itemsToShow.length;
    }, StartInterval);

    return () => clearInterval(interval);
  }, []);

  const removeOldestIfNeeded = (items: Item[]): Item[] => {
    return items.length >= 34 ? items.slice(0, 10) : items;
  };

  const handleDrop = (item: Item) => {
    setVisibleItems((prev) => {
      const trimmed = dropMode === "circular" ? removeOldestIfNeeded(prev) : prev;
      if (dropMode === "limitar" && prev.length >= 14) return prev;
      return [item, ...trimmed];
    });
  };

  const resetAndShowAgain = () => {
    setVisibleItems([]);
    setIsAllShown(false);
  };

  useEffect(() => {
    if (isAllShown) {
      setTimeout(() => {
        resetAndShowAgain();
      }, 3000);
    }
  }, [isAllShown]);

  type Rarity = 'raro' | 'comum' | 'epico';
  type RarityType = "CHAMPION" | "AMIX" | "XPLAY";

  const rarityToType: Record<Rarity, string> = {
    raro: "CHAMPION",
    comum: "AMIX",
    epico: "XPLAY",
  };

  const rarityToTypex = (rarity: Rarity): RarityType => {
    switch (rarity) {
      case 'comum': return 'AMIX';
      case 'raro': return 'CHAMPION';
      case 'epico': return 'XPLAY';
    }
  };

  const getGradientByRarity = (rarity: Rarity) => {
    const type = rarityToType[rarity];
    return skinCards.find((card) => card.type === type)?.gradient || "#1e1e1e";
  };

  const getRarityShadowColor = (rarity: Rarity): string => {
    switch (rarity) {
      case 'epico': return '#ff4444';
      case 'raro': return '#ffcc00';
      case 'comum': return '#b347ff';
      default: return '#888';
    }
  };

  const bloquearTeclas = (event: KeyboardEvent) => {
    if (event.key === '<' || event.key === '>' || event.keyCode === 37 || event.keyCode === 39) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', bloquearTeclas);
    return () => document.removeEventListener('keydown', bloquearTeclas);
  }, []);

  const navigateToProduct = (item: Item) => {
    setSelectedItemId(String(item.id));
    setTimeout(() => {
      const productName = encodeURIComponent(item.nameitem.toLowerCase().replace(/\s+/g, "-"));
      router.push(`${ROUTENVX.viewitem}/${productName}?id=${item.id}`);
    }, 600); // tempo suficiente para ver a sombra
  };

  return (
    <Margin>
      <header className="flex flex-col w-full">
        <div className="flex h-[114px] items-center gap-2.5 py-[9px] w-full">
          <div className="flex h-24 pl-3">
            <div className="flex w-[136px] h-24 rounded bg-[#161817]">
              <div className="flex flex-col justify-center flex-1">
                <div className="flex flex-col items-center relative overflow-hidden justify-center pt-[22px] pb-6 bg-keydropcomcharade">
                  <img src="/theim/cards/20240924_174742.jpg" alt='novision' className='iconns' />
                </div>
              </div>
              <div className="flex flex-col w-11 gap-0.5 rounded-[0px_4px_4px_0px] overflow-hidden">
               <Button className="flex items-center justify-center h-12 bg-[#242524] rounded-[0px_4px_0px_0px] p-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#bcc4c5"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-footprints"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>
              </Button>
              <Button className="flex items-center justify-center h-12 bg-[#183324] rounded-[0px_0px_4px_0px] p-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#bcc4c5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12v12z"/></svg>
              </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 h-24 overflow-hidden">
            <div className="flex items-center overflow-hidden relative">
              <AnimatePresence initial={true}>
                {visibleItems.map((item, index) => {
                  const isSelected = selectedItemId === String(item.id);
                  const shadowColor = getRarityShadowColor(item.rarity);

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -100, x: -50 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        x: 0,
                       
                      }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                      }}
                    >
                      <Card
                        onClick={() => navigateToProduct(item)}
                        className="w-24 h-24 mr-1.5 rounded overflow-hidden cursor-pointer"
                        style={{
                          background: getGradientByRarity(item.rarity),
                          transition: 'box-shadow 0.3s ease',
                        
                        border: isSelected ? `2px solid ${shadowColor}` : 'none',
                        }}
                      >
                        <CardContent className="p-0 h-full relative">
                          <div className="absolute top-1.5 left-[42px]">
                            <TypeRaritity rarity={`${rarityToTypex(item.rarity)}`} size="h-4 w-4" />
                          </div>
                          <div
                            className="absolute w-full h-[59px] top-6 bg-contain bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${item.imagem})` }}
                          />
                          <div className="absolute w-[84px] top-[81px] left-1.5 text-center">
                            <div className="font-keydrop-com-poppins-semibold-title text-keydropcomwhite-70 text-[9px] leading-[9px] whitespace-nowrap">
                              {item.nameitem}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </header>
    </Margin>
  );
};

const Margin = styled.div`
  .iconns {
    height: 100px;
    border-radius: 9px;
    transform: rotate(9deg);
  }
`;
