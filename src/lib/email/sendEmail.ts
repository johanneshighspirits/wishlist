'use server';

import { InvitationTemplate } from '@/components/email/InvitationTemplate';
import { Resend } from 'resend';
import { serverSanitizeUserInput } from './serverSanitize';
import validator from 'validator';

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailProps = {
  receiver: string;
  invitedBy: string;
  wishlistTitle: string;
};

export const sendInvitationEmail = async ({
  receiver,
  invitedBy,
  wishlistTitle,
}: SendEmailProps) => {
  receiver = serverSanitizeUserInput(receiver);
  invitedBy = serverSanitizeUserInput(invitedBy);
  wishlistTitle = serverSanitizeUserInput(wishlistTitle);
  if (validator.isEmail(receiver) && validator.isEmail(invitedBy)) {
    const { data, error } = await resend.emails.send({
      from: 'Önskelistan <johannes@highspirits.se>',
      to: [receiver],
      subject: `Inbjudan till ${wishlistTitle}`,
      react: InvitationTemplate({
        invitedBy,
        wishlistTitle,
      }),
    });
    console.log(`Invitation email sent to ${receiver}`);
    console.log({ data, error });
  } else {
    console.error(`[sendInvitationEmail] Malicious data?`);
  }
};
