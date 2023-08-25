import { storage } from '@/appWrite';

const getURL = async ({ bucketId, fileId }: Image) => {
  const url = storage.getFilePreview(bucketId, fileId);

  return url;
};

export default getURL;
