type InvitationTemplateProps = {
  invitedBy: string;
  wishlistTitle: string;
};

export const InvitationTemplate = ({
  invitedBy,
  wishlistTitle,
}: InvitationTemplateProps) => (
  <div>
    <h1>Hej!</h1>
    <p>
      Du har blivit inbjuden till {wishlistTitle}. Inbjudan kommer från{' '}
      {invitedBy}
    </p>
    <p>
      Logga in på{' '}
      <a href="https://jaybo-wishlist.vercel.app">💝 Önskelistan 💝</a> för att
      acceptera.
    </p>
  </div>
);
