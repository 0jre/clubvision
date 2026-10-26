interface ChatMessage {
    id: string;
    date: Date;
    hours: string;
    message: string;
  }
  
  interface Ticket {
    _id: string;
    status: string;
    ticket: string;
    data: string;
    userId: string;
    chat: {
      team: ChatMessage[];
      member: ChatMessage[];
    };
  }
  