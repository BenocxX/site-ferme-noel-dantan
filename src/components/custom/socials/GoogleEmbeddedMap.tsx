export function GoogleEmbeddedMap({ className }: { className?: string }) {
  return (
    <iframe
      className={className}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=Autocueillette+de+sapin+-+Ferme+Noël+d+antan`}
    ></iframe>
  );
}
