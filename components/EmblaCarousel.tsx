'use client';

import { useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface CarouselItem {
  title: string;
  description: string;
  image?: string;
}

interface EmblaCarouselProps {
  items: CarouselItem[];
  cardsPerView?: number;
  maxWidth?: string;
}

export function EmblaCarousel({
  items,
  cardsPerView = 3,
  maxWidth = '1200px',
}: EmblaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    align: 'start',
  });
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
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

  const cardWidth = `calc(${100 / cardsPerView}% - ${(cardsPerView - 1) * 16} / ${cardsPerView}px)`;

  return (
    <div style={{ width: '100%', maxWidth, margin: '0 auto', padding: '20px' }}>
      <div ref={emblaRef} style={{ overflow: 'hidden', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ flex: `0 0 ${cardWidth}`, minWidth: 0 }}>
              <Card sx={{ height: '100%' }}>
                {item.image && (
                  <CardMedia
                    component="img"
                    alt={item.title}
                    height="200"
                    image={item.image}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item.description}
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <button onClick={scrollPrev} style={{ padding: '10px 20px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          ← Prev
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {Array.from({ length: count }).map((_, idx) => (
            <div
              key={idx}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: idx === current ? '#000' : '#ccc',
              }}
            />
          ))}
        </div>

        <button onClick={scrollNext} style={{ padding: '10px 20px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          Next →
        </button>
      </div>
    </div>
  );
}