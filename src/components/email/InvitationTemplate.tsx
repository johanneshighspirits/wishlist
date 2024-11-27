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
  shortURL: string;
  bgImg: string;
};

export const InvitationTemplateContent = ({
  invitedBy,
  wishlistTitle,
  shortURL,
  bgImg,
}: InvitationTemplateProps) => (
  <Section
    style={{
      height: '424px',
      marginTop: '16px',
      marginBottom: '16px',
      borderRadius: '12px',
      backgroundColor: '#a73161',
      backgroundImage: bgImg,
      backgroundSize: '200% 200%',
    }}>
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
      <Link href={`mailto:${invitedBy}`} style={{ color: '#fff !important' }}>
        {invitedBy}
      </Link>
    </Text>
    <Button
      href={`https://jaybo-wishlist.vercel.app/invitations`}
      style={{
        marginTop: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#fff',
        backgroundColor: '#000',
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 12,
        paddingBottom: 12,
        fontWeight: 600,
        color: '#fff',
      }}>
      Acceptera inbjudan
    </Button>
  </Section>
);

export const InvitationTemplate = (props: InvitationTemplateProps) => {
  return (
    <EmailContainer>
      <InvitationTemplateContent {...props} />
    </EmailContainer>
  );
};
