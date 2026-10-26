L.marker([-6024, 3300], { icon: cardIcon4 }).addTo(map)
  .on('click', () => {
    window.parent.postMessage({
      type: 'markerClick',
      data: {
        name: "Extra Mercado",
        rating: 3.9,
        timelac: 3,
        reviewsCount: 3502,
        category: "Supermarket",
        address: "R. Londrina, 6635 - Boqueirão, Praia Grande - SP, 11700-020",
        openStatus: "Open · Closes 12AM",
        loc: "-6024, 3300",
        plusCode: "XHPP+QX Boqueirão, Praia Grande - State of São Paulo",
        image: "https://content.rockstarnews.ru/up/images/4797cc9dfe41a8c7808e0e5fd8a795c4.png",
        accessibility: [
          "Wheelchair-accessible car park",
          "Wheelchair-accessible entrance"
        ],
        lochere: [
          "Kerbside pickup",
          "No-contact delivery",
          "Delivery",
          "In-store pick-up",
          "In-store shopping",
          "Same-day delivery"
        ],
        highlights: ["Great produce"],
        offerings: ["Organic products", "Prepared foods"],
        planning: ["Quick visit"],
        recycling: ["Batteries"],
        payments: ["PIX", "Credit card", "Cash"],
        description: `Miami is known for its beaches, arts, culture, and nightlife. The city's downtown is home to the largest
              concentration of international banks in the United States and many large national and international
              companies. The Port of Miami is the busiest cruise port in the world in both passenger traffic and cruise
              lines.`,
        descriptionless: `Miami is known for its beaches, arts, culture, and nightlife. The city's downtown is home to the largest
              concentration of international banks in the United States and many large national and international
              companies. The Port of Miami is the busiest cruise port in the world in both passenger traffic and cruise
              lines.`,
      }
    }, '*');
  });
