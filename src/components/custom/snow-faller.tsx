export function SnowFaller({ length = 10 }: { length?: number }) {
  return Array.from({ length }).map(() => (
    <div className="snow">
      <div></div>
    </div>
  ));
}
