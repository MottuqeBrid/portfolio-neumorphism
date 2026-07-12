import { supabase } from "./supabaseClient";

export const fileUpload = async (file: File) => {
  if (!file) return;

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("portfolio")
    .upload(fileName, file);
  console.log("Upload result from supabase:", { data, error });
  if (error) {
    // console.log("Upload error:", error);
    return "";
  } else {
    // console.log("Uploaded:", data);
    const { data: imgData } = await supabase.storage
      .from("portfolio")
      .getPublicUrl(fileName);
    return imgData.publicUrl;
  }
};
