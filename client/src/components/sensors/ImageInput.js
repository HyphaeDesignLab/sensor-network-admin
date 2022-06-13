import React, {useState, useRef, useEffect} from "react";

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

const ImageInput = ({onLoaded, label, fitToBox={width: 2400, height: 2400}}) => {

    const [isImageDataLoading, setImageDataLoading] = useState('');
    let imageTypeRef = '';
    const tmpImageRef = useRef(null);
    const tmpImageFileReaderRef = useRef(null);
    const handleImageChange = event => {
        if (event.target.files) {
            setImageDataLoading(true);
            let imgFile = event.target.files[0];
            imageTypeRef = imgFile.type;
            tmpImageFileReaderRef.current.readAsDataURL(imgFile);
        }
    }

    const handleImageLoaded = event => {
        // RESIZE TO FIT IN BOX
        const [width, height] = getImgDimensionsFitInBox(tmpImageRef.current, fitToBox.width, fitToBox.height);

        // Dynamically create a canvas element
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        var canvasContext = canvas.getContext("2d");
        canvasContext.drawImage(tmpImageRef.current, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(imageTypeRef); // get base64
        onLoaded(dataUrl);
        setImageDataLoading(false);
    };

    const handleFileReaderLoad = event => {
        tmpImageRef.current.src = event.target.result;
    }

    useEffect(() => {

        tmpImageRef.current = document.createElement('img');
        tmpImageRef.current.addEventListener('load', handleImageLoaded);

        tmpImageFileReaderRef.current = new FileReader();
        tmpImageFileReaderRef.current.addEventListener('load', handleFileReaderLoad);

        return () => {
            tmpImageRef.current.removeEventListener('load', handleImageLoaded);
            tmpImageFileReaderRef.current.removeEventListener('load', handleFileReaderLoad);
        }
    }, []);

    return <form style={{display: 'inline'}}>
        <label className='button-link'>{label}<input type="file" onChange={handleImageChange} className='offpage' /></label>
        {isImageDataLoading && <div>Loading image...</div>}
        </form>;
};

export default ImageInput;
