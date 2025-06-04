import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { updateFileToCloudinary } from "./image-service";

export const updateUser = async (
  uid: string,
  updateData: UserDataType
): Promise<ResponseType> => {
  try {
    let image = updateData.image;
    /* Upload image */
    if (updateData.image && updateData.image.uri) {
      const imageUploadRes = await updateFileToCloudinary(
        updateData.image,
        "users"
      );

      console.log("imageUploadRes -->", imageUploadRes);

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload image",
        };
      }
      image = imageUploadRes.data;
    }

    updateData.image = image;

    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, updateData);

    return { success: true };
  } catch (error: any) {
    console.log("Error updating user:", error);
    return { success: false, msg: error?.message };
  }
};
