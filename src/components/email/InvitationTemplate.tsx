import {
  Section,
  Row,
  Column,
  Img,
  Link,
  Text,
  Heading,
  Button,
  Container,
} from '@react-email/components';
import { EmailContainer } from './EmailContainer';

type InvitationTemplateProps = {
  invitedBy: string;
  wishlistTitle: string;
  wishlistId: string;
};

export const InvitationTemplateContent = ({
  invitedBy,
  wishlistTitle,
  wishlistId,
}: InvitationTemplateProps) => (
  <>
    <table
      align="center"
      border={0}
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={{
        height: 424,
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: 'black',
        backgroundImage:
          'radial-gradient(at 64% 47%, rgba(141, 156, 84, 0.3) 0%, rgba(156, 96, 84, 0.3) 25%, rgba(156, 84, 143, 0.3) 50%, rgba(147, 84, 156, 0.3) 75%, rgba(156, 115, 84, 0.3) 100%), radial-gradient(at 16% 51%, rgba(54, 181, 147, 0.3) 0%, rgba(181, 54, 69, 0.3) 33%, rgba(181, 54, 160, 0.3) 67%, rgba(181, 130, 54, 0.3) 100%), radial-gradient(at 17% 38%, rgba(87, 57, 177, 0.3) 0%, rgba(137, 177, 57, 0.3) 50%, rgba(177, 57, 149, 0.3) 100%)',
        backgroundSize: '200% 200%',
      }}
      width="100%">
      <tbody>
        <tr>
          <td align="center" style={{ padding: 40, textAlign: 'center' }}>
            <Text
              style={{
                margin: '0px',
                fontWeight: 600,
                color: 'rgb(229,231,235)',
              }}>
              Inbjudan
            </Text>
            <Heading
              as="h1"
              style={{
                margin: '0px',
                marginTop: 4,
                fontWeight: 700,
                color: 'rgb(255,255,255)',
              }}>
              {wishlistTitle}
            </Heading>
            <Text
              style={{
                margin: '0px',
                marginTop: 8,
                fontSize: 16,
                lineHeight: '24px',
                color: 'rgb(255,255,255)',
              }}>
              Du har blivit inbjuden till {wishlistTitle}. Inbjudan kommer från{' '}
              {invitedBy}
            </Text>
            <Button
              href={`https://jaybo-wishlist.vercel.app/wishlists/${wishlistId}`}
              style={{
                marginTop: 24,
                borderRadius: 8,
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'rgb(229,231,235)',
                backgroundColor: 'rgb(255,255,255)',
                paddingLeft: 40,
                paddingRight: 40,
                paddingTop: 12,
                paddingBottom: 12,
                fontWeight: 600,
                color: 'rgb(17,24,39)',
              }}>
              Acceptera inbjudan
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </>
);

export const InvitationTemplate = (props: InvitationTemplateProps) => {
  return (
    <EmailContainer>
      <InvitationTemplateContent {...props} />
    </EmailContainer>
  );
};
