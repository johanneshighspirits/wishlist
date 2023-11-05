import { LinkButton } from './common/Link';

export const OpenWishlist = ({
  id,
  readOnly = false,
  className,
}: {
  id: string;
  readOnly?: boolean;
  className?: string;
}) => {
  return (
    <>
      <LinkButton
        href={`/wishlists/${id}${readOnly ? '?readonly=true' : ''}`}
        className={className}>
        Öppna{readOnly ? ' (i önskarläge)' : ''}
      </LinkButton>
      {readOnly && (
        <span>
          I &raquo;<span className="font-bold">önskarläge</span>&laquo; döljs
          vad som är bokat eller köpt.
          <br />
          Perfekt om mottagaren sitter bredvid och spionerar.
        </span>
      )}
    </>
  );
};
