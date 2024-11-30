"use client";

import { Wishlist } from "@/lib/wishlists/types";
import { Form, useForm } from "./forms/Form";
import { SubmitButton } from "./forms/SubmitButton";
import { Dispatch, MouseEventHandler, SetStateAction, useState } from "react";
import { FieldConfig } from "./forms/types";
import { Validators } from "./forms/Validators";
import { Input } from "./forms/Input";
import { Button } from "./common/Button";
import clsx from "clsx";
import { uninviteEmailFromWishlist } from "@/lib/wishlists";
import { inviteMembersToWishlist } from "@/app/actions";
import { useDialog } from "./providers/DialogProvider";

const fields: FieldConfig<string>[] = [];

export const MembersEditor = ({ wishlist }: { wishlist: Wishlist }) => {
  const [fieldNames, setFieldNames] = useState<string[]>([]);
  const [buttonText, setButtonText] = useState("Bjud in användare");
  const { openDialog } = useDialog();
  const formAction = async (data: FormData) => {
    if (fieldNames.length <= 0) {
      return;
    }
    setButtonText("Bjuder in medlemmar, vänta...");
    data.append("keys", fieldNames.join(" "));
    const enhancedAddMembers = inviteMembersToWishlist.bind(
      null,
      wishlist.id,
      wishlist.title,
      wishlist.shortURL,
      wishlist.bgImg || "",
    );
    const addedMembers = await enhancedAddMembers(data);
    if (!addedMembers) {
      setButtonText("Bjud in användare");
      openDialog({
        title: "Ingen att bjuda in",
        body: <p>Du måste välja någon att lägga till</p>,
      });
      setFieldNames([]);
    } else {
      setButtonText("Medlemmar tillagda");
      openDialog({
        title: "Medlemmar inbjudna",
        body: (
          <>
            <p>Inbjudna medlemmar</p>
            <ul>
              {addedMembers.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </>
        ),
      });
      setFieldNames([]);
      setButtonText("Bjud in användare");
    }
  };

  return (
    <>
      <p>Dela listan med andra genom att klicka på knappen ↘</p>
      <Form
        fields={fields}
        action={formAction}
        className={
          fieldNames.length > 0
            ? "border border-dotted border-white/50 rounded-lg p-4"
            : ""
        }
      >
        {fieldNames.map((fieldName) => {
          return <Input name={fieldName} key={fieldName} />;
        })}
        <MoreEmailFields
          wishlistId={wishlist.id}
          receiver={wishlist.receiverEmail}
          fieldNames={fieldNames}
          setFieldNames={setFieldNames}
          submitButtonText={buttonText}
        ></MoreEmailFields>
      </Form>
    </>
  );
};

type MemberInfo = {
  email: string;
  accepted: boolean;
  declined: boolean;
  isCurrentUser: boolean;
};

const MoreEmailFields = ({
  wishlistId,
  receiver,
  fieldNames,
  setFieldNames,
  submitButtonText,
}: {
  wishlistId: string;
  receiver?: string;
  fieldNames: string[];
  setFieldNames: Dispatch<SetStateAction<string[]>>;
  submitButtonText: string;
}) => {
  const { addField } = useForm();
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (fieldNames.length === 0) {
      fetch(`/api/wishlists/${wishlistId}/members`, { method: "POST" })
        .then((res) => res.json())
        .then((result: { members: MemberInfo[]; recentMembers: string[] }) => {
          const { members, recentMembers } = result;
          setMembers(members);
          recentMembers.forEach((recentMember, i) => {
            addField({
              name: recentMember,
              type: "checkbox",
              initialValue: recentMember,
              labelText: recentMember,
            });
          });
          setFieldNames((fieldNames) => [
            ...fieldNames,
            `member-${fieldNames.length}`,
            ...recentMembers,
          ]);
          addField({
            name: `member-${fieldNames.length}`,
            type: "email",
            labelText: `Lägg till medlem ${
              fieldNames.length > 1 ? fieldNames.length + 1 : ""
            }`,
            placeholderText: "Epostadress att bjuda in",
            validators: [
              Validators.email(),
              Validators.notInList({
                list: members.map((m) => m.email),
                message: "Användaren är redan inbjuden",
              }),
            ],
          });
        });
    }
  };
  return (
    <>
      <Button
        variant="secondary"
        className="self-end my-4"
        onClick={handleClick}
      >
        {fieldNames.length > 0
          ? "Lägg till ytterligare en epost"
          : "Dela listan"}
      </Button>
      {fieldNames.length > 0 ? (
        <SubmitButton>{submitButtonText}</SubmitButton>
      ) : null}

      <AlreadyInvited
        wishlistId={wishlistId}
        members={members}
        receiver={receiver}
      />
    </>
  );
};

const AlreadyInvited = ({
  members,
  wishlistId,
  receiver,
}: {
  members: MemberInfo[];
  wishlistId: string;
  receiver?: string;
}) => {
  const [isUninviteInProgress, setIsUninviteInProgress] = useState(false);
  const uninviteMember = async (memberEmail: string) => {
    setIsUninviteInProgress(true);
    await uninviteEmailFromWishlist(memberEmail, wishlistId);
    // setMembers((members) =>
    //   members.filter((member) => member.email !== memberEmail),
    // );
    setIsUninviteInProgress(false);
  };
  return members.length > 0 ? (
    <div className="flex flex-col gap-2 my-2">
      <div>
        <p className="italic text-gray-300">Redan inbjudna:</p>
        <ul className="flex flex-col py-2">
          {members.map((member) => {
            const isReceiver = member.email === receiver;
            return isReceiver ? (
              <li
                key={member.email}
                className="flex w-fit items-center py-1 px-3 rounded-md italic bg-white/20"
              >
                {`💝 ${member.email} 💝`}
              </li>
            ) : (
              <li
                key={member.email}
                className={clsx("flex items-center gap-4 py-1 px-2 rounded-md")}
              >
                <span>
                  {member.email}
                  {member.isCurrentUser
                    ? ""
                    : member.accepted
                      ? " ✅"
                      : member.declined
                        ? " ⛔️"
                        : ""}
                </span>
                {!member.isCurrentUser && (
                  <Button
                    disabled={isUninviteInProgress}
                    title={
                      member.accepted ? "Remove user" : "Delete invitation"
                    }
                    variant="destructive"
                    size="inline"
                    onClick={(e) => {
                      e.preventDefault();
                      uninviteMember(member.email);
                    }}
                  >
                    x
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  ) : null;
};
