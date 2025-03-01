export const SelectTravelsList = [
    {
        id: 1,
        title: 'Just Me',
        desc: 'A solo traveler exploring the world',
        icon: '🧳', // Luggage
        people: '1'
    },
    {
        id: 2,
        title: 'A Couple',
        desc: 'Two travelers in tandem',
        icon: '❤️', // Heart (for couples)
        people: '2 people'
    },
    {
        id: 3,
        title: 'Family',
        desc: 'A fun-loving family adventure',
        icon: '🏡', // Home (family-oriented)
        people: '3 to 5 people'
    },
    {
        id: 4,
        title: 'Friends',
        desc: 'An exciting trip with friends',
        icon: '🎉', // Celebration emoji
        people: '3 to 6 people'
    },
    {
        id: 5,
        title: 'Group Tour',
        desc: 'A large group exploring together',
        icon: '🚌', // Bus (group tours)
        people: '6+ people'
    }
];

export const SelectBudgetOptions = [
    {
        id: 1,
        title: 'Budget',
        desc: 'Stay cost-conscious and travel smart',
        icon: '💰' // Money bag
    },
    {
        id: 2,
        title: 'Moderate',
        desc: 'A balanced mix of comfort and savings',
        icon: '💵' // Dollar bills
    },
    {
        id: 3,
        title: 'Luxury',
        desc: "Indulge in premium experiences",
        icon: '✨' // Sparkles (luxury feel)
    },
    {
        id: 4,
        title: 'Ultra Luxury',
        desc: 'Private jets, five-star hotels, and the best of the best',
        icon: '🛩️' // Small airplane (private travel)
    },
    {
        id: 5,
        title: 'Backpacker',
        desc: 'Minimalist travel with adventure',
        icon: '🎒' // Backpack (for budget travelers)
    }
];

export const AI_PROMPT = 'Generate Travel Plan for Location: {location} for {totalDays} Days for {traveler} with a {budget} budget, give me Hotels options list with HotelName,Hotel address, Price ,hotel image url, geo cordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing,Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format.';
