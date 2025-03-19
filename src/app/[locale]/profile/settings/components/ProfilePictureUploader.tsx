"use client";

import { ApiResponse, ApiStatus } from "@/interfaces/Apis/ApiResponse";
import apiClient from "@/utils/apiClient";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ImageNext from "next/image";

interface ProfilePictureUploaderProps {
  initialImage: string;
}

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  initialImage,
}) => {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState<string>(initialImage);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Optionally update the displayed image with a local preview
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImageSrc(reader.result as string);
        }
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("profileImage", file, file.name);

      setIsSaving(true);
      try {
        const apiResponse: ApiResponse<{ profilePicture: string }> =
          await apiClient("/api/protected/post-profile-image", {
            method: "POST",
            body: formData,
          });

        if (apiResponse.status === ApiStatus.FAILURE) {
          throw new Error(apiResponse.message);
        }

        router.refresh();
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          toast.error(e.message);
        } else {
          toast.error("Failed to change profile picture");
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Profile Picture Display */}
      <div
        className="relative grid place-items-center aspect-square w-32 h-32 rounded-full overflow-hidden border-4 border-transparent shadow-lg cursor-pointer transition-transform transform hover:scale-105"
        onClick={() => document.getElementById("profileImageInput")?.click()}
      >
        <ImageNext
          width={250}
          height={250}
          src={imageSrc}
          alt="Profile"
          className="object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-white font-semibold">Change Image</span>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        className="hidden"
        id="profileImageInput"
      />
    </div>
  );
};

export default ProfilePictureUploader;
