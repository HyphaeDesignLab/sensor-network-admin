import React, {useState, useEffect} from "react";

export default function InputNumber({value, name}) {
    const [isEditable, setEditable] = useState(false);
    const handleEditClick = e => {
        setEditable(s => !s);
    }
    const handleCancelClick = e => {
        e.preventDefault();
        setEditable(false)
    }

    return (
        <div>
            {!!name && <strong>{name}: </strong>}
            {isEditable ?
                <span>
                    <input type='number' value={value} />
                    <a href='#' onClick={handleCancelClick}>cancel</a>
                </span>
                :
                <span onClick={handleEditClick}>{value}</span>
            }
        </div>
    );
};