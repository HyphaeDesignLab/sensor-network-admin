import React, {useState, useEffect, useRef} from "react";

export default function InputNumber({value, name}) {
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
    const handleInputBlur = e => {
        setEditable(false);
    }
    const handleKeyUp = e => {
        console.log(e.code);
        if (e.code === 'Escape') {
            setEditable(false);
        }
    }
    const handleCancelClick = e => {
        e.preventDefault();
        setEditable(false)
    }

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
                           value={value}
                           onChange={handleChange}
                           onBlur={handleInputBlur}
                           onKeyUp={handleKeyUp}
                           style={{width: inputLength}}/>
                    <a href='#' onClick={handleCancelClick}>cancel</a>
                </span>
                :
                <span ref={textElRef} className='text-length-measurable' onClick={handleEditClick}>{value}</span>
            }
        </div>
    );
};