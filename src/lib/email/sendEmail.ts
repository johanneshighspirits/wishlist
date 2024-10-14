'use server';

import { InvitationTemplate } from '@/components/email/InvitationTemplate';
import { Resend } from 'resend';
import { serverSanitizeUserInput } from './serverSanitize';
import validator from 'validator';
import { InvitationAcceptedTemplate } from '@/components/email/InvitationAcceptedTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

type SendInvitationEmailProps = {
  receiver: string;
  invitedBy: string;
  wishlistTitle: string;
  shortURL: string;
  bgImg: string;
};

export const sendInvitationEmail = async ({
  receiver,
  invitedBy,
  wishlistTitle,
  shortURL,
  bgImg,
}: SendInvitationEmailProps) => {
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
        shortURL,
        bgImg,
      }),
    });
    console.log(`Invitation email sent to ${receiver}`);
    console.log({ data, error });
  } else {
    console.error(`[sendInvitationEmail] Malicious data?`);
  }
};

type SendInvitationAcceptedEmailProps = {
  invited: string;
  invitedBy: string;
  wishlistTitle: string;
  shortURL: string;
};

export const sendInvitationAcceptedEmail = async ({
  invited,
  invitedBy,
  wishlistTitle,
  shortURL,
}: SendInvitationAcceptedEmailProps) => {
  invited = serverSanitizeUserInput(invited);
  invitedBy = serverSanitizeUserInput(invitedBy);
  wishlistTitle = serverSanitizeUserInput(wishlistTitle);
  if (validator.isEmail(invited) && validator.isEmail(invitedBy)) {
    const { data, error } = await resend.emails.send({
      from: 'Önskelistan <johannes@highspirits.se>',
      to: [invitedBy],
      subject: `Inbjudan till ${wishlistTitle} accepterad`,
      react: InvitationAcceptedTemplate({
        invited,
        wishlistTitle,
        shortURL,
      }),
    });
    console.log(`Invitation accepted by ${invited}`);
    console.log({ data, error });
  } else {
    console.error(`[sendInvitationAcceptedEmail] Malicious data?`);
  }
};
