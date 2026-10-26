export interface GiveawayCard {
  id: string;
  type: "CHAMPION" | "XPLAY" |  "AMIX";
  typeColor: string;
  participants: number;
  itemName: string;
  itemCondition: string;
  skinName: string;
  price: string;
  countdown: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    daysLabel: string;
  };
  totalItems: number;
  totalValue: string;
  imageUrl: string;
  url: string;
}