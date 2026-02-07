export type OpeningTimes = {
  [day: string]: { open: string; close: string };
};

export type Club = {
  id: number;
  name: string;
  lat: number;
  long: number;
  tags: string[];
  training_days: string[];
  postcode?: string;
  address?: string;
  httpspicture?: string;
  rating?: number;
  reviews?: string[];
  opening_times?: OpeningTimes;
};

export const clubs: Club[] = [
  {
    id: 1,
    name: "Cardiff RFC",
    lat: 51.4769,
    long: -3.1737,
    tags: ["play", "inclusive", "woman", "LGBTQ"],
    training_days: ["Tuesday", "Thursday"],
    postcode: "CF10 1EP",
    address: "Cardiff Arms Park, Westgate St, Cardiff CF10 1EP",
    httpspicture:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Cardiff_RFC_Logo.svg/1200px-Cardiff_RFC_Logo.svg.png",
    rating: 4.5,
    reviews: [
      "Great club with a welcoming atmosphere!",
      "Excellent training sessions and friendly members.",
      "A fantastic place to play rugby and make friends.",
    ],
    openingtime: "Monday to Friday: 9:00 AM - 6:00 PM, Saturday: 10:00 AM - 4:00 PM, Sunday: Closed",
    opening_hours: {
      Mon: "9:00 AM – 6:00 PM",
      Tue: "9:00 AM – 6:00 PM",
      Wed: "9:00 AM – 6:00 PM",
      Thu: "9:00 AM – 6:00 PM",
      Fri: "9:00 AM – 5:00 PM",
      Sat: "Closed",
      Sun: "Closed",
    },
  },
  {
    id: 2,
    name: "Penarth RFC",
    lat: 51.4482,
    long: -3.1798,
    tags: ["play", "volunteer"],
    training_days: ["Monday", "Thursday"],
    postcode: "CF64 1RD",
    address: "Penarth, Vale of Glamorgan CF64 1RD",
    httpspicture:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/Penarth_RFC_Logo.svg/1200px-Penarth_RFC_Logo.svg.png",
    rating: 4.2,
    reviews: [
      "A great club with a strong community spirit.",
      "The training sessions are well-organized and fun.",
      "Friendly members and a welcoming environment.",
    ],
    openingtime: "Monday to Friday: 9:00 AM - 5:00 PM, Saturday: 10:00 AM - 3:00 PM, Sunday: Closed",
    opening_hours: {
      Mon: "10:00 AM – 4:00 PM",
      Tue: "10:00 AM – 6:00 PM",
      Wed: "10:00 AM – 4:00 PM",
      Thu: "10:00 AM – 6:00 PM",
      Fri: "10:00 AM – 3:00 PM",
      Sat: "Closed",
      Sun: "Closed",
    },
  },
  {
    id: 3,
    name: "Newport RFC",
    lat: 51.5874,
    long: -3.0099,
    tags: ["play", "inclusive", "woman"],
    training_days: ["Tuesday", "Thursday"],
    postcode: "NP20 1PA",
    address: "Newport, NP20 1PA",
    httpspicture:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Newport_RFC_Logo.svg/1200px-Newport_RFC_Logo.svg.png",
    rating: 4.5,
    reviews: [
      "A fantastic club with a rich history and great facilities.",
      "The training sessions are top-notch and the coaches are excellent.",
      "A welcoming and inclusive environment for players of all levels.",
    ],
    openingtime: "Monday to Friday: 9:00 AM - 6:00 PM, Saturday: 10:00 AM - 4:00 PM, Sunday: Closed",
    opening_hours: {
      Mon: "9:30 AM – 6:30 PM",
      Tue: "9:30 AM – 6:30 PM",
      Wed: "9:30 AM – 6:30 PM",
      Thu: "9:30 AM – 6:30 PM",
      Fri: "9:30 AM – 5:00 PM",
      Sat: "Closed",
      Sun: "Closed",
    },
  },
];
