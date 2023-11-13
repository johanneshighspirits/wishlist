import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef, ChangeEventHandler } from 'react';
import { useForm } from './forms/Form';

const createBlob = async (
  filename: string,
  canvas: HTMLCanvasElement,
  wishlistId: string
) => {
  return new Promise<PutBlobResult>((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        return reject('Could not save the image, try again later...');
      }
      const blobFile = new File([blob], filename, { type: 'image/png' });
      const response = await fetch(
        `/api/upload?filename=${filename}&wishlistId=${wishlistId}`,
        {
          method: 'POST',
          body: blobFile,
        }
      );
      const newBlob: PutBlobResult = await response.json();
      return resolve(newBlob);
    });
  });
};

export const ImageUploader = ({
  name: formFieldName,
  options = { width: 320, height: 320 },
}: {
  name: string;
  options?: { width: number; height: number };
}) => {
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
      const croppedWidth = isLandscape
        ? options.width
        : img.width * (options.height / img.height);
      const croppedHeight = isLandscape
        ? img.height * (options.width / img.width)
        : options.height;
      ctx?.drawImage(img, 0, 0, croppedWidth, croppedHeight);
      try {
        const blob = await createBlob(
          file.name,
          canvasRef.current!,
          wishlistId
        );
        setStatusText('Bilden är uppladdad');
        setBlob(blob);
      } catch (err) {
        console.error(err);
      }
      setIsProcessing(false);
    };
    img.src = objectURL;
  };

  return (
    <div className="flex flex-col lg:flex-row lg:gap-8 w-full justify-between items-center">
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
        className="h-auto w-32 lg:h-48 mb-2 lg:my-4"
        width={options.width}
        height={options.height}></canvas>
    </div>
  );
};
