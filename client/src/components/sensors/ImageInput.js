import React, {useState} from "react";

const getImgDimensionsFitInBox = (img, MAX_WIDTH, MAX_HEIGHT) => {
    var width = img.width;
    var height = img.height;
    if (width > height) {
        if (width > MAX_WIDTH) {
            height = height * (MAX_WIDTH / width);
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width = width * (MAX_HEIGHT / height);
            height = MAX_HEIGHT;
        }
    }
    return [width, height];
};

const ImageInput = ({onLoaded, fitToBox={width: 2400, height: 2400}}) => {

    const [imageData, setImageData] = useState('');
    const [isImageDataLoading, setImageDataLoading] = useState('');
    const handleImageChange = event => {
        if (event.target.files) {
            setImageDataLoading(true);
            let imgFile = event.target.files[0];

            var imgOriginal = document.createElement('img');
            imgOriginal.onload = function (event) {
                // RESIZE TO FIT IN BOX
                const [width, height] = getImgDimensionsFitInBox(imgOriginal, fitToBox.width, fitToBox.height);

                // Dynamically create a canvas element
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;

                var canvasContext = canvas.getContext("2d");
                canvasContext.drawImage(imgOriginal, 0, 0, width, height);

                const dataUrl = canvas.toDataURL(imgFile.type); // get base64
                onLoaded(dataUrl);
                setImageDataLoading(false);
            }

            var reader = new FileReader();
            reader.onload = readerEvent => {
                imgOriginal.src = readerEvent.target.result;
            }
            reader.readAsDataURL(imgFile);
        }
    }

    return <form>
        <input type="file" onChange={handleImageChange} />
        {isImageDataLoading && <div>Loading image...</div>}
        </form>;
};

export default ImageInput;
