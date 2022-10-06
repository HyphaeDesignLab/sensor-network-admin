import React, {useState, useEffect, useRef} from 'react';
import ImageInput from "./ImageInput";
import ImageCrop from "./ImageCrop";
// if image is too large for OCR to work we might have to
//  crop it via a library: https://www.npmjs.com/package/react-image-crop

const ocrOptions = {
    detectOrientation: false,
    scale: true,
    OCREngine: 2
}

const addOcrAmbigiousCharsMarkup = text => text.replace(/[4sef0z]/ig, m => `<span style="color: red; font-weight: bold; ">${m[0]}</span>`);

const SensorOcrParser = ({onConfirm, onCancel, headingLevel=3}) => {
    const Hx = 'h'+headingLevel;
    const [imageData, setImageData] = useState('');
    const [preCroppedImageData, setPreCroppedImageData] = useState(null);
    const [croppedImageData, setCroppedImageData] = useState(null);
    const handleImageChange = photo => {
        setImageData(photo);
    }

    const handleUndoCropped = () => {
        setImageData(preCroppedImageData);
        setPreCroppedImageData(null);
    };
    const handleCancelCropped = () => {
        setIsCropping(false);
        setCroppedImageData(null);
    };
    const handleSaveCropped = () => {
        setIsCropping(false);
        setPreCroppedImageData(imageData);
        setImageData(croppedImageData);
        setCroppedImageData(null);
    };
    const [isCropping, setIsCropping] = useState();

    const [isOcrTextLoading, setOcrTextLoading] = useState(false);
    const [ocrTextError, setOcrTextError] = useState('');
    const [ocrText, setOcrText] = useState('');
    const handleOcrParseClick = event => {
        const formData = new FormData();
        formData.append('apikey', 'K83508668988957')
        formData.append('base64Image', imageData)
        Object.entries(ocrOptions).forEach(e => formData.append(e[0], e[1]));

        setOcrTextLoading(true);
        fetch('https://api.ocr.space/parse/image', {
            method: 'post',
            body: formData
        })
            .then(response => response.json())
            .then(json => {
                if (json.ErrorMessage) {
                    setOcrTextError(json.ErrorMessage);
                } else {
                    setOcrText(json.ParsedResults[0].ParsedText);
                }
            }, error => {
                setOcrTextError(error instanceof Error ? error.message : error);
            })
            .finally(() => {
                setOcrTextLoading(false);
            })
    };

    const [sensorIds, setSensorIds] = useState({deveui:'', appeui:'', appkey:''});
    const devEuiElRef = useRef();
    const appEuiElRef = useRef();
    const appKeyElRef = useRef();
    const sensorIdProps = {
        deveui: {title: 'Dev EUI', ref: devEuiElRef},
        appeui: {title: 'App EUI', ref: appEuiElRef},
        appkey: {title: 'App Key', ref: appKeyElRef}
    };

    useEffect(() => {
        if (!ocrText) {
            return;
        }
        const matches = ocrText.toLowerCase()
            .replaceAll(/([\n\r]|\\[nr])+/g, '~')
            .replace(/ +/g, '').replace(/:~|~:/g, ':')
            .matchAll(/(deveui|appeui|appkey):([^~]+)/g);
        const ids = {};

        let match = matches.next();
        while(!match.done) {
            const id = match.value[1];
            const value = match.value[2];
            ids[id] = value.toUpperCase();
            sensorIdProps[id].ref.current.innerHTML = addOcrAmbigiousCharsMarkup(value);
            match=matches.next()
        }
        setSensorIds(ids);
    }, [ocrText]);

    const [editableIds, setEditableIds] = useState({});
    const handleSaveOrEdit = (sensorId, isSave) => {
        const el = sensorIdProps[sensorId].ref.current;

        if (isSave) {
            setSensorIds({...sensorIds, [sensorId]: el.innerText});
            setEditableIds({...editableIds, [sensorId]: false});
        } else {
            el.innerHTML = addOcrAmbigiousCharsMarkup(sensorIds[sensorId]);
            setEditableIds({...editableIds, [sensorId]: true});
            el.focus();
        }
    };

    const handleConfirmClick = () => {
      onConfirm(sensorIds);
    };

    const handleCancelClick = () => {
        onCancel();
    };

    return <section>
        <Hx>Upload/Take a Photo of Sensor Registration Keys</Hx>
        <ImageInput onLoaded={handleImageChange} label='Upload/Take Photo' fitToBox={{width: 1600, height: 1600}} />&nbsp;
        <button className='link' type='button' onClick={handleCancelClick}>cancel</button>
        {!!imageData && <div>
            {!isCropping && <div>
                <div>Note: scroll up and down to see entire image content</div>
                <div style={{maxHeight: '150px', maxWidth: '920px', overflowY: 'scroll'}}>
                    <img src={imageData} style={{width: '100%'}} />
                </div>
            </div>
            }
            {!isCropping ?
                <div>
                    <button  className='link' onClick={() => setIsCropping(true)}>Crop Image</button>
                    {Boolean(preCroppedImageData) && <button className='link' onClick={handleUndoCropped}>Undo Crop</button>}
                </div>
                :
                <div>
                    <ImageCrop imgSrc={imageData} onCrop={data => setCroppedImageData(data)} />
                    <button className='link' onClick={handleSaveCropped}>Use Cropped Image</button>
                    <button className='link' onClick={handleCancelCropped}>cancel </button>
                </div>
            }
            {!isCropping && !ocrText &&
                <button className='link' type='button' onClick={handleOcrParseClick} disabled={isOcrTextLoading}>Parse Text from Image</button>
            }
            {isOcrTextLoading &&
                <div>Parsing text via OCR...</div>
            }
            {!!ocrTextError &&
                <div>{ocrTextError}</div>
            }
        </div>}
        {!!ocrText && <div>
            <Hx>Parsed Sensor IDs (Please review/edit)</Hx>
            {Object.keys(sensorIdProps).map(sensorId =>
            <div key={sensorId}>
                <span>{sensorIdProps[sensorId].title}</span>:
                <span ref={sensorIdProps[sensorId].ref}
                      contentEditable={editableIds[sensorId] ? 'true' : 'false'}
                      style={{
                          border: editableIds[sensorId] ? '1px solid black' : 'none',
                          padding: '5px',
                          fontSize: '140%',
                          fontFamily: 'monospace, sans-serif',
                          letterSpacing: '3px'
                        }}
                ></span>
                <button className='link' type='button' onClick={handleSaveOrEdit.bind(null, sensorId, !!editableIds[sensorId])}>{editableIds[sensorId] ? 'save' : 'edit'}</button>
            </div>)}
        </div>}

        {!!ocrText && <React.Fragment><button type='button' onClick={handleConfirmClick}>Confirm &amp; Save</button> &nbsp;</React.Fragment>}
    </section>;
};

/*
{
  "ParsedResults": [
      {
          "TextOverlay": {
              "Lines": [],
              "HasOverlay": false,
              "Message": "Text overlay is not provided as it is not requested"
          },
          "TextOrientation": "0",
          "FileParseExitCode": 1,
          "ParsedText": "sweetsmill\r\napp-donations\r\napp-registration\r\n",
          "ErrorMessage": "",
          "ErrorDetails": ""
      }
  ],
  "OCRExitCode": 1,
  "IsErroredOnProcessing": false,
  "ProcessingTimeInMilliseconds": "312",
  "SearchablePDFURL": "Searchable PDF not generated as it was not requested."
}
*/
export default SensorOcrParser;