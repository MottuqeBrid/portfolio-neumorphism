type ImgbbUploadResult = {
  url: string;
  deleteUrl: string;
  data: ImgbbResponse["data"];
  success: boolean;
  status: number;
};

type ImgbbResponse = {
  success: boolean;
  status: number;
  data: {
    url: string;
    delete_url: string;
    [key: string]: unknown;
  };
};

const imgbbImageUpload = async (image: File): Promise<ImgbbUploadResult> => {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("IMGBB_API_KEY is not set");
  }

  const formData = new FormData();
  formData.append("image", image);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const json = (await res.json()) as ImgbbResponse;
  console.log("imgbb upload response:", json);

  if (!res.ok || !json.success) {
    throw new Error(`imgbb upload failed with status ${res.status}`);
  }

  return {
    ...json,
    url: json.data.url,
    deleteUrl: json.data.delete_url,
  };
};

export default imgbbImageUpload;
