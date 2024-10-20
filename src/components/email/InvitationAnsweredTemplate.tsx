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
} from "@react-email/components";
import { EmailContainer } from "./EmailContainer";

type InvitationAnsweredTemplateProps = {
  accepted: boolean;
  invited: string;
  wishlistTitle: string;
  shortURL: string;
};

export const InvitationAnsweredTemplateContent = ({
  accepted,
  invited,
  wishlistTitle,
  shortURL,
}: InvitationAnsweredTemplateProps) => (
  <>
    <table
      align="center"
      border={0}
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={{
        height: "424px",
        marginTop: "16px",
        marginBottom: "16px",
        borderRadius: "12px",
        backgroundColor: "#265691",
      }}
      width="100%"
    >
      <tbody>
        <tr>
          <td align="center" style={{ padding: 40, textAlign: "center" }}>
            <Text
              style={{
                margin: "0px",
                fontWeight: 600,
                color: "rgb(229,231,235)",
              }}
            >
              {wishlistTitle}
            </Text>
            <Heading
              as="h1"
              style={{
                margin: "0px",
                marginTop: 4,
                fontWeight: 700,
                color: "rgb(255,255,255)",
              }}
            >
              Inbjudan {accepted ? "accepterad" : "avböjd"}
            </Heading>
            <Text
              style={{
                margin: "0px",
                marginTop: 8,
                fontSize: 16,
                lineHeight: "24px",
                color: "rgb(255,255,255)",
              }}
            >
              <Link
                href={`mailto:${invited}`}
                style={{ color: "#fff !important" }}
              >
                {invited}
              </Link>{" "}
              har {accepted ? "accepterat" : "avböjt"} din inbjudan till{" "}
              {wishlistTitle}!
            </Text>
            <Button
              href={`https://jaybo-wishlist.vercel.app/wishlists/${shortURL}`}
              style={{
                marginTop: 24,
                borderRadius: 8,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#fff",
                backgroundColor: "#000",
                paddingLeft: 40,
                paddingRight: 40,
                paddingTop: 12,
                paddingBottom: 12,
                fontWeight: 600,
                color: "#fff",
              }}
            >
              Gå till önskelistan
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </>
);

export const InvitationAnsweredTemplate = (
  props: InvitationAnsweredTemplateProps,
) => {
  return (
    <EmailContainer>
      <InvitationAnsweredTemplateContent {...props} />
    </EmailContainer>
  );
};
