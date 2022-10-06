import React, {useState, useRef} from 'react'
import ImageInput from "../../components/sensors/ImageInput";
import ImageCrop from "../../components/sensors/ImageCrop";

export default function App() {
    const [src, setSrc] = useState();
    const [isCrop, setIsCrop] = useState(false);
    const [cropped, setCropped] = useState(false);

    const handleCropped = cropped => {
        setCropped(cropped);
        setIsCrop(false);
    }

    return (
        <div>
            <ImageInput onLoaded={dataUrl => setSrc(dataUrl)} label='Image' />
            {!!src && <div>
                {!isCrop && <img src={src} style={{maxHeight: '90vh', maxWidth: '90%'}} />}<br/>
                <button onClick={() => setIsCrop(v => !v)}>Crop</button>
                {isCrop ? <div>
                        <ImageCrop imgSrc={src} onCrop={handleCropped} />
                    </div> :
                    (!!cropped ? <div>Cropped: <img src={cropped} style={{maxHeight: '90vh', maxWidth: '90%'}} /></div> : null)
                }
            </div>}

        </div>
    )
}