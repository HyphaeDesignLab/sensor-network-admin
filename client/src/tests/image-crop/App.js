import React, {useState, useEffect} from 'react';
import ReactCrop from 'react-image-crop'
import ImageInput from "../../components/sensors/ImageInput";

function App() {
    const [imgSrc, setImgSrc] = useState();
    const [crop, setCrop] = useState({
        unit: '%', // Can be 'px' or '%'
        x: 25,
        y: 25,
        width: 50,
        height: 50
    });

    return (
        <div>
            <ImageInput onLoaded={dataUrl => setImgSrc(dataUrl)}></ImageInput>
            <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                <img src={imgSrc} />
            </ReactCrop>
        </div>
    );
}

export default App;
