'use client';

import { useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function CardCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    align: 'start',
  });
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedIndex());
    setCount(emblaApi.scrollSnapList().length);
  }, [emblaApi]);

  useState(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  });

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );

  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const cards = [
    { title: 'Card 1', description: 'Lizards are a widespread group of squamate reptiles with over 6,000 species.' },
    { title: 'Card 2', description: 'Snakes are elongated, legless carnivorous reptiles of the suborder Serpentes.' },
    { title: 'Card 3', description: 'Turtles are reptiles of the order Testudines characterized by a special bony.' },
    { title: 'Card 4', description: 'Crocodilians are large reptiles found in tropical regions around the world.' },
    { title: 'Card 5', description: 'Geckos are small to medium-sized lizards found in warm climates.' },
    { title: 'Card 6', description: 'Iguanas are herbivorous lizards native to Central and South America.' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div ref={emblaRef} style={{ overflow: 'hidden', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {cards.map((card, idx) => (
            <div
              key={idx}
              style={{
                flex: '0 0 calc(33.333% - 11px)',
                minWidth: 0,
              }}
            >
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  alt={card.title}
                  height="200"
                  image={`https://picsum.photos/300/200?random=${idx}`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {card.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <button onClick={scrollPrev} style={{ padding: '10px 20px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          ← Prev
        </button>

        {/* Pagination dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {Array.from({ length: count }).map((_, idx) => (
            <div
              key={idx}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: idx === current ? '#000' : '#ccc',
                transition: 'background-color 0.3s',
              }}
            />
          ))}
        </div>

        <button onClick={scrollNext} style={{ padding: '10px 20px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          Next →
        </button>
      </div>

      {/* Slide counter */}
      <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
        {current + 1} / {count}
      </div>
    </div>
  );
}