function getImageScale(sizeX, sizeY, image) {
    var scaleX = sizeX/image.width;
    var scaleY = sizeY/image.height;
    return Math.min(scaleX, scaleY);
}

function scaleTo(sizeX, sizeY, image) {
    var scale = getImageScale(sizeX, sizeY, image);
    image.scale.setTo(scale, scale);
}