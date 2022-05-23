import React, {useState, useEffect, useRef} from 'react';

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
}
const ocrOptions = {
    detectOrientation: false,
    scale: true,
    OCREngine: 2
}

const addOcrAmbigiousCharsMarkup = text => text.replace(/[4s0]/ig, m => `<span style="color: red; font-weight: bold; ">${m[0]}</span>`);

const SensorOcrParser = ({onConfirmed}) => {
    const [imageData, setImageData] = useState('');
    const [isImageDataLoading, setImageDataLoading] = useState('');
    const onImageChange = event => {
        if (event.target.files) {
            setImageDataLoading(true);
            let imgFile = event.target.files[0];

            var imgOriginal = document.createElement('img');
            imgOriginal.onload = function (event) {
                // RESIZE TO FIT IN BOX
                const [width, height] = getImgDimensionsFitInBox(imgOriginal, 3600, 3600);

                // Dynamically create a canvas element
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;

                var canvasContext = canvas.getContext("2d");
                canvasContext.drawImage(imgOriginal, 0, 0, width, height);

                const dataUrl = canvas.toDataURL(imgFile.type); // get base64
                setImageData(dataUrl);
                setOcrText('');
                setImageDataLoading(false);
            }

            var reader = new FileReader();
            reader.onload = readerEvent => {
                imgOriginal.src = readerEvent.target.result;
            }
            reader.readAsDataURL(imgFile);
        }
    }

    const [isOcrTextLoading, setOcrTextLoading] = useState(false);
    const [ocrTextError, setOcrTextError] = useState('');
    const [ocrText, setOcrText] = useState('');
    const onOcrParseClick = event => {
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

    const [editableId, setEditableId] = useState('');
    const onSaveOrEdit = sensorId => {
        const el = sensorIdProps[sensorId].ref.current;
        if (editableId === sensorId) {
            setSensorIds({...sensorIds, [sensorId]: el.innerText});
            setEditableId('');
        } else {
            if (!!editableId) {
                // if switch sensor id editing, but previous sensor ID was not explicitly saved
                // reset last one to pre-saved
                el.innerHTML = addOcrAmbigiousCharsMarkup(sensorIds[sensorId]);
            }
            el.contentEditable = true;
            setEditableId(sensorId);
            el.focus();
        }
    };

    const onConfirmIds = () => {
      onConfirmed(sensorIds);
    };
    return <div>
        <h2>Upload/Take a Photo of Sensor Registration Keys</h2>
        <form>
            <input type="file" onChange={onImageChange} />
            {isImageDataLoading && <div>Loading image...</div>}
        </form>
        {!!imageData && <div>
            <div style={{maxHeight: '400px', overflowY: 'scroll'}}><img src={imageData} style={{width: '90%', maxWidth: '920px'}} /></div>
            {!ocrText && <button type='button' onClick={onOcrParseClick} disabled={isOcrTextLoading}>Parse Text from Image</button>}
            {isOcrTextLoading && <div>Parsing text via OCR...</div>}
            {!!ocrTextError && <div>{ocrTextError}</div>}
        </div>}
        {!!ocrText && <div>
            <h3>Parsed Sensor IDs (Please review/edit)</h3>
            {Object.keys(sensorIdProps).map(sensorId =>
            <div key={sensorId}>
                <span>{sensorIdProps[sensorId].title}</span>:
                <span ref={sensorIdProps[sensorId].ref}
                      contentEditable={editableId === sensorId ? 'true' : 'false'}
                      style={{
                          border: editableId === sensorId ? '1px solid black' : 'none',
                          padding: '5px',
                          fontSize: '140%',
                          fontFamily: 'monospace, sans-serif',
                          letterSpacing: '3px'
                        }}
                ></span>
                <button type='button' onClick={onSaveOrEdit.bind(null, sensorId)}>{editableId === sensorId ? 'save' : 'edit'}</button>
            </div>)}
        </div>}

        <button type='button' onClick={save}>Confirm</button>
    </div>;
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