import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase.config";

export const uploadImg = (file, setProgress) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `Banner Blog/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        {
          setProgress &&
            setProgress(
              ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(
                2
              )
            );
        }
      },
      (err) => {
        reject(err.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};
