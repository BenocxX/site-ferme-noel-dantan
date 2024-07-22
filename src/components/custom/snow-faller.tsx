export function SnowFaller({ length = 10 }: { length?: number }) {
  return Array.from({ length }).map((_, i) => (
    <div key={i} className="snow">
      <div></div>
    </div>
  ));
}
