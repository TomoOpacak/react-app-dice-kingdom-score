export const preloadImages = (imageArray) => {
  return Promise.all(
    imageArray.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    }),
  );
};
