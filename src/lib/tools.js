export const getImgUrl = (imgPath, width = 185)=> {
    return `//image.tmdb.org/t/p/w${width}${imgPath}`
};

export const getFormattedTime = (__time) => {
    const _s = Math.floor(__time);
    const _m = Math.floor(__time / 60);
    return _m + ':' + _s;
};