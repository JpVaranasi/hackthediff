import { Button } from '@/components/ui/button';
import { SaveIcon } from 'lucide-react';
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader } from '@mui/material';
import { EmblaCarousel } from '@/components/EmblaCarousel';

export default function GetInvolved() {
const items = [
    { title: 'Item 1', description: 'Description 1', image: '/images/cardiff lions.jpg' },
    { title: 'Item 2', description: 'Description 2', image: '/images/cardiff lions.jpg' },
    { title: 'Item 3', description: 'Description 3', image: '/images/cardiff lions.jpg' },
    { title: 'Item 4', description: 'Description 4', image: '/images/cardiff lions.jpg' },
    { title: 'Item 5', description: 'Description 5', image: '/images/cardiff lions.jpg' },
    { title: 'Item 6', description: 'Description 6', image: '/images/cardiff lions.jpg' },

  ];

  return (
    <div>
    <ThemeToggle />
      <h1>Get Involved</h1>
      <h2>Inclusive Rugby Clubs</h2>
      <p>Many rugby clubs welcome players of all skill levels and backgrounds. Joining a club can provide a supportive community and opportunities for personal growth.</p>
      <h2>Find ways to get involved</h2>
        <ul>
            <li>Join a local rugby club or team.</li>
            <li>Volunteer as a coach or referee.</li>
            <li>Attend rugby matches and support your local teams.</li>
        </ul>
        <Button variant="default">Join Now</Button>

        <EmblaCarousel items={items} cardsPerView={3} maxWidth="1200px" />

    </div>
  );
}

