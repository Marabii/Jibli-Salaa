"use client";

import ImageNext from "next/image";
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

interface ProfilePictureUploaderProps {
  initialImage: string;
  onImageCropped?: (croppedImage: string) => void;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // to avoid cross-origin issues
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        resolve(url);
      } else {
        reject(new Error("Canvas is empty"));
      }
    }, "image/jpeg");
  });
}

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  initialImage,
  onImageCropped,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(initialImage);
  const [showCropModal, setShowCropModal] = useState<boolean>(false);
  const [newImage, setNewImage] = useState<string>(initialImage);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 10, y: 10 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (reader.result) {
          setNewImage(reader.result as string);
          setShowCropModal(true);
        }
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(newImage, croppedAreaPixels);
      setImageSrc(croppedImage);
      setShowCropModal(false);
      if (onImageCropped) {
        onImageCropped(croppedImage);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {/* Display the profile picture */}
      <div
        onClick={() => setShowCropModal(true)}
        className="cursor-pointer relative w-64 h-64 rounded-full overflow-hidden border-8 border-transparent bg-gradient-to-r from-purple-500 to-pink-400 p-1"
      >
        <ImageNext src={imageSrc} alt="Profile" fill className="object-cover" />
      </div>
      {/* Hidden file input for replacing the image */}
      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="hidden"
          id="profileImageInput"
        />
        <label
          htmlFor="profileImageInput"
          className="cursor-pointer text-blue-500 underline"
        >
          Upload new image
        </label>
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="relative w-full h-64 bg-gray-200">
              <Cropper
                image={newImage}
                crop={crop}
                zoom={zoom}
                cropSize={{ width: 200, height: 200 }}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={onCropSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUploader;
