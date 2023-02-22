export const loadImages = (map, images) => {
    const promises = [];
    for (let image of images) {
        promises.push(new Promise((resolve, reject) => {
            map.loadImage(image[1], (err ,img) => {
                if (err) return reject(err);
                
                map.addImage(image[0], img);
                resolve();
            });
        }));
    }
    
    return Promise.all(promises);
}