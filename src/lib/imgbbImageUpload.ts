type ImgbbResponse = {
  success: boolean;
  status: number;
  data: {
    url: string;
    display_url: string;
  };
};

const imgbbImageUpload = async (image: File): Promise<string> => {
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

  if (!res.ok || !json.success) {
    throw new Error(`imgbb upload failed with status ${res.status}`);
  }

  return json.data.display_url;
};

export default imgbbImageUpload;
