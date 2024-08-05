export interface FacebookEmbeddedPageProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  pageName: string;
  width: number;
  height: number;
}

export function FacebookEmbeddedPage({
  pageName,
  className,
  width,
  height,
  ...props
}: FacebookEmbeddedPageProps) {
  return (
    <iframe
      src={`http://www.facebook.com/plugins/likebox.php?href=http%3A%2F%2Fwww.facebook.com%2F${pageName}&colorscheme=light&show_faces=true&border_color&stream=true&header=true&width=${width}&height=${height}`}
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      {...props}
    />
  );
}
