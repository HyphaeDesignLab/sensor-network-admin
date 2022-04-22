import React, {useState, useEffect} from "react";
import InputNested from './Input';
import addUniqueKey from "../uniqueKey";

export default function InputArray({arr, name}) {
    return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <div>
            {!!name && <strong>{name}: </strong>}
            {arr.map((item, i) => <InputNested key={addUniqueKey(item)} schema={item} name={String(i)} />)}
        </div>
    );
};