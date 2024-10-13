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
  bgImg: string;
};

export const InvitationTemplateContent = ({
  invitedBy,
  wishlistTitle,
  wishlistId,
  bgImg,
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
        backgroundImage: bgImg,
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
