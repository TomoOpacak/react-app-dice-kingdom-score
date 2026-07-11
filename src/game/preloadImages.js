export const preloadImages = (imageArray) => {
  return Promise.all(
    imageArray.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = async () => {
          try {
            if (img.decode) {
              await img.decode();
            }
          } catch (e) {
            // ignore decode failures
          }

          resolve(img);
        };

        img.onerror = reject;

        img.src = src;
      });
    }),
  );
};
