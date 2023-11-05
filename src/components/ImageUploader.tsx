import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef, ChangeEventHandler } from 'react';
import { useForm } from './forms/Form';

export const ImageUploader = ({ name: formFieldName }: { name: string }) => {
  const { getValue, setIsProcessing } = useForm();
  const wishlistId = getValue('wishlistId');
  const [statusText, setStatusText] = useState('Välj en bild från din dator');
  const inputFileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    event.preventDefault();
    if (!inputFileRef.current?.files) {
      throw new Error('Välj en bild att ladda upp');
    }
    const file = inputFileRef.current.files[0];
    setIsProcessing(true);
    setStatusText(`Laddar upp ${file.name}, vänta...`);
    const objectURL = URL.createObjectURL(file);
    const img = document.createElement('img');
    img.onload = async () => {
      const ctx = canvasRef.current!.getContext('2d');
      const ratio = img.width / img.height;
      const isLandscape = ratio < 1;
      const croppedWidth = isLandscape ? 320 : img.width * (320 / img.height);
      const croppedHeight = isLandscape ? img.height * (320 / img.width) : 320;
      ctx?.drawImage(img, 0, 0, croppedWidth, croppedHeight);

      canvasRef.current!.toBlob(async (blob) => {
        if (!blob) {
          setIsProcessing(false);
          throw new Error('Could not save the image, try again later...');
        }
        const blobFile = new File([blob], file.name, { type: 'image/png' });
        const formData = new FormData();
        formData.append('file', blobFile);
        const response = await fetch(
          `/api/upload?filename=${file.name}&wishlistId=${wishlistId}`,
          {
            method: 'POST',
            body: blobFile,
          }
        );
        const newBlob = (await response.json()) as PutBlobResult;
        setStatusText('Bilden är uppladdad');
        setBlob(newBlob);
        setIsProcessing(false);
      });
    };
    img.src = objectURL;
  };

  return (
    <div className="flex gap-8 w-full justify-between items-center">
      {!blob ? (
        <label className="flex flex-col gap-4 py-4 cursor-pointer">
          <p>{statusText}</p>
          <input
            name="file"
            className="cursor-pointer file:cursor-pointer file:mr-6 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm
            file:bg-gray-300 file:text-black
            hover:file:bg-white"
            ref={inputFileRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </label>
      ) : (
        <>
          <input type="hidden" value={blob.url} readOnly name={formFieldName} />
          <p>{statusText}</p>
        </>
      )}
      <canvas
        ref={canvasRef}
        className="h-48 my-4"
        width="320"
        height="320"></canvas>
    </div>
  );
};
