export function GoogleEmbeddedMap({ className }: { className?: string }) {
  return (
    <iframe
      // width="600"
      // height="450"
      className={className}
      loading="lazy"
      allowFullScreen
      // eslint-disable-next-line react/no-unknown-property
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=Autocueillette+de+sapin+-+Ferme+Noël+d+antan`}
    ></iframe>
  );
}
