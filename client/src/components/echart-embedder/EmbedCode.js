import React, {useState, useEffect, useRef} from 'react';
import InputDate from "../InputDate";
import './embed.css';

const EmbedCode = ({model, onChange}) => {

    // the embed text area element reference, as we will use it to "select all" and attempt to "copy" programmatically
    const embedTextRef = useRef('');


    // When selecting the embed code, try to automatically COPY into clipboard,
    //    if succeeded, show message
    //   else if that fails, show error message
    const [codeCopiedMessage, setCodeCopiedMessage] = useState('');
    const handleSelectAndCopyEmbed = () => {
        embedTextRef.current.select();
        navigator.clipboard.writeText(embedTextRef.current.value).then(() => {
            setCodeCopiedMessage('The code has been copied to the clipboard for pasting')
        }).catch(e => {
            setCodeCopiedMessage('Please manually copy to be able to paste')
        }).finally(() => {
            codeCopiedMessageTimeout.current = setTimeout(() => {
                setCodeCopiedMessage('')
            }, 2000);
        });
    };

    // a timeout to hide copy success/error
    const codeCopiedMessageTimeout = useRef(null);
    // on component unmount, clear the timeout (as it was a side-effect and could trigger a set-state on a gone component
    useEffect(() => {
        return () => {
            clearTimeout(codeCopiedMessageTimeout.current);
        }
    }, []);


    const [isChanged, setIsChanged] = useState(false);

    const [startDate, setStartDate] = useState(model.time_start);
    const [endDate, setEndDate] = useState(model.time_end);

    useEffect(() => {
        if (!model) {
            return;
        }
        const embedCode =
            `<div style="width: 100%; height: 80%;"
                 data-data-url="${model.data_url}&start=${startDate.getTime()}&end=${endDate.getTime()}"
                 data-echart
                 data-echart-type="${model.type}"
            ></div>`;
        embedTextRef.current.value = embedCode.replaceAll("\n", ' ').replace(/ +/g, ' ');
    }, [startDate, endDate]);

    const handleSaveStartDate = fragment => {
        setStartDate(fragment.date);
        setIsChanged(true);
    };

    const handleSaveDate = fragment => {
        onChange({...model, ...fragment}).then(() => {

        })
    };

    return <div className='embed-editor'>
        {model.name}
        <InputDate path={'time_start'} onSave={handleSaveDate} value={startDate} />
        <InputDate path={'time_end'} onSave={handleSaveDate} value={endDate} />
        <div className='copy-code-wrapper'>
            <textarea onClick={handleSelectAndCopyEmbed} ref={embedTextRef} ></textarea>
            {!!codeCopiedMessage && <div className='copy-message'>{codeCopiedMessage}</div>}
        </div>
        {isChanged && <button type='button' onClick={handleSave}>Save</button>}
    </div>;
};

export default EmbedCode;