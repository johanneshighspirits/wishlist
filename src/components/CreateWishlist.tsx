"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import { Form, useForm } from "./forms/Form";
import { FieldConfig } from "./forms/types";
import { createWishlist } from "@/app/actions";
import { Input } from "./forms/Input";
import { Button } from "./common/Button";
import { Validators } from "./forms/Validators";
import { randomGradientBackground } from "@/utils/random";
import { FantasyBackground } from "./FantasyBackground";
import clsx from "clsx";
import { SubmitButton } from "./forms/SubmitButton";

function toJson<T>(data: Response) {
  return data.json() as Promise<T>;
}

function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit | undefined) {
  return fetch(input, init).then(toJson<T>);
}

const defaultButtonText = "Skapa ny önskelista (+)";

const formConfig = {
  title: {
    name: "title",
    type: "text",
    placeholderText: "Namn på önskelistan",
    labelText: "Titel",
    validators: [Validators.required()],
  },
  isMine: {
    name: "isMine",
    type: "checkbox",
    labelText: "Det är jag som önskar",
    // initialValue: 'on',
  },
  receiverEmail: {
    name: "receiverEmail",
    type: "email",
    placeholderText: "Mottagarens email",
    labelText: "Önskare",
    infoText:
      "Skriv in epost till den som önskar, så göms vissa fält automatiskt. Vi vill ju inte avslöja något i förväg...",
    validators: [Validators.email()],
  },
};
type FieldNames = keyof typeof formConfig;
const fields: FieldConfig<FieldNames>[] = Object.values(
  formConfig,
) as FieldConfig<FieldNames>[];

const randomBg = () => randomGradientBackground().backgroundImage;

export const CreateWishlist = () => {
  const [buttonText, setButtonText] = useState(defaultButtonText);
  const [bgImg, setImgBg] = useState("");
  const router = useRouter();
  const formAction = async (data: FormData) => {
    setButtonText("Skapar ny önskelista, vänta...");
    data.append("bgImg", bgImg);
    const wishlist = await createWishlist(data);
    setButtonText("Öppnar önskelistan...");
    setTimeout(() => {
      router.push(`/wishlists/${wishlist.shortURL}`);
    }, 1000);
  };

  const generateBackground = () => {
    setImgBg(randomBg());
  };

  useEffect(() => {
    setImgBg(randomBg());
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg border-white">
      <Form fields={fields} action={formAction}>
        <Input<FieldNames> name="title" />
        <Input<FieldNames> name="isMine" />
        <ReceiverEmail>
          <Input<FieldNames> name="receiverEmail" />
        </ReceiverEmail>

        <FantasyBackground
          backgroundImage={bgImg}
          className={clsx(
            "flex flex-col gap-4 items-center justify-center h-32 w-full lg:w-8/12 mx-auto my-4 lg:my-8 transition-opacity duration-1000",
            bgImg ? "opacity-100" : "opacity-0",
          )}
        >
          <p>Slumpad bakgrundsfärg</p>
          <Button
            onClick={(e) => {
              e.preventDefault();
              generateBackground();
            }}
          >
            Generera ny
          </Button>
        </FantasyBackground>
        <SubmitButton>{buttonText}</SubmitButton>
      </Form>
    </div>
  );
};

const ReceiverEmail = ({ children }: PropsWithChildren) => {
  const { getValue } = useForm();
  const isHidden = getValue("isMine") === "on";
  if (isHidden) {
    return null;
  }
  return children;
};
