export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data?.url) {
    throw new Error(data?.message || "Upload failed");
  }

  return data.url as string;
}

export function createImageUploadHandler() {
  return async (file: File): Promise<string> => {
    return uploadImage(file);
  };
}
