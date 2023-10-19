import { LinkButton } from './common/Link';

export const OpenWishlist = ({
  id,
  className,
}: {
  id: string;
  className?: string;
}) => {
  return (
    <LinkButton href={`/wishlists/${id}`} className={className}>
      Öppna
    </LinkButton>
  );
};
