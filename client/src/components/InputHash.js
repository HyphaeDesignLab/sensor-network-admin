import React, {useState, useEffect} from "react";
import InputNested from './Input';

export default function InputHash({hash, name}) {
    return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <div>
            {!!name && <strong>{name}: </strong>}
            {Object.keys(hash).map(itemKey => <InputNested key={itemKey} schema={hash[itemKey]} name={itemKey}/> )}
        </div>
    );
};