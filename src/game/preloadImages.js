export const preloadImages = (imageArray) => {
  return Promise.all(
    imageArray.map((src) => {
      return new Promise(async (resolve) => {
        const img = new Image();
        img.src = src;

        try {
          await img.decode(); // 👈 KEY FIX (mobile important)
        } catch (e) {
          // fallback if decode not supported
        }

        resolve();
      });
    }),
  );
};
