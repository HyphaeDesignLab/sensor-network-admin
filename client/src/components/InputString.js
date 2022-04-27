import React, {useState, useEffect, useRef} from "react";

export default function InputString({value, name, onSave}) {
    const [newValue, setNewValue] = useState(value);
    const [oldValue, setOldValue] = useState(value);
    useEffect(() => {
        setOldValue(value);
        setNewValue(value);
    }, [value]);

    const [isChanged, setIsChanged] = useState(false);
    useEffect(() => {
        setIsChanged(newValue !== oldValue);
    }, [oldValue, newValue]);

    const inputRef = useRef(null);

    const [isEditable, setEditable] = useState(false);
    useEffect(() => {
        if (isEditable) {
            inputRef.current.focus();
        }
    }, [isEditable]);

    const handleEditClick = e => {
        setEditable(true);
    }

    const handleKeyUp = e => {
        if (e.code === 'Escape') {
            setEditable(false);
            setNewValue(oldValue);
        }
    }
    const handleCancelClick = e => {
        e.preventDefault();
        setEditable(false);
        setNewValue(oldValue);
    }

    const handleChange = e => {
        setNewValue(e.target.value);
    };

    const handleSaveClick = () => {
        // e.g. name=style or center.0  center.1  or someProps.nestedProp
        onSave( {[name]: newValue} );
        setOldValue(newValue);
        setEditable(false);
    };


    const textElRef = useRef(null);
    const [inputLength, setInputLength] = useState('auto');
    useEffect(() => {
        setInputLength(window.getComputedStyle(textElRef.current).width);
    }, []);

    return (
        <div>
            {!!name && <strong>{name}: </strong>}
            {isEditable ?
                <span>
                    <input ref={inputRef}
                           value={newValue}
                           onChange={handleChange}
                           onKeyUp={handleKeyUp}
                           style={{width: inputLength}} />
                </span>
                :
                <span ref={textElRef} className='text-length-measurable' onClick={handleEditClick}>{oldValue}</span>
            }
            {isEditable && <span>&nbsp;<a href='#' onClick={handleCancelClick}>cancel</a></span>}
            {isChanged && <span>&nbsp;<a href='#' onClick={handleSaveClick}>save</a></span>}

        </div>
    );
};