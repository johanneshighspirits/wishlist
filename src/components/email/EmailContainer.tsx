import {
  Body,
  Html,
  Head,
  Font,
  Section,
  Row,
  Column,
  Link,
} from '@react-email/components';
import { PropsWithChildren } from 'react';

export const EmailContainer = ({ children }: PropsWithChildren) => {
  return (
    <Html lang="sv">
      <Head>
        <Font
          fontFamily="Glegoo"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/glegoo/v16/_Xmt-HQyrTKWaw25jaOYIoxlxhCV.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body
        style={{
          backgroundColor: 'black',
          color: 'white',
          paddingLeft: 48,
          paddingRight: 48,
          paddingBottom: 48,
        }}>
        <Section
          style={{
            paddingTop: 40,
            paddingBottom: 40,
            paddingLeft: 32,
            paddingRight: 32,
            marginTop: 40,
            marginBottom: 40,
          }}>
          <Row>
            <Column align="center">
              <div style={{ fontSize: '80px', lineHeight: 1 }}>💝</div>
            </Column>
          </Row>
          <Row style={{ marginTop: 24 }}>
            <Column align="center">
              <table>
                <tr>
                  <td style={{ paddingRight: 8, paddingLeft: 8 }}>
                    <Link
                      href="https://jaybo-wishlist.vercel.app"
                      style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '32px',
                      }}>
                      Önskelistan
                    </Link>
                  </td>
                </tr>
              </table>
            </Column>
          </Row>
        </Section>
        {children}
      </Body>
    </Html>
  );
};
