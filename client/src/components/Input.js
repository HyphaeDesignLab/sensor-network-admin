import React, {useState, useEffect} from "react";
import InputArray from './InputArray';
import InputHash from './InputHash';
import InputNumber from './InputNumber';
import InputString from './InputString';
import InputBoolean from './InputBoolean';

export default function Input({schema, name=''}) {
    const [schemaType, setSchemaType] = useState(false);
    const [value, setValue] = useState(schema);

    const onChangeHandler = (name, value) => {
        console.log(`saving ${name}: new value ${value}`);
        setValue(value);
    };

    useEffect(() => {
        if (schema) {
            if (schema instanceof Array) {
                setSchemaType('array');
            } else if (schema instanceof Object) {
                setSchemaType('hash');
            } else {
                const type = (typeof schema);
                switch(type) {
                    case 'number':
                    case 'string':
                    case 'boolean':
                        setSchemaType(type);
                        break;
                    default:
                        setSchemaType(false);
                        break;
                }
            }
        }
    }, []);
    return (
        <div>
            {schemaType === 'array' && <InputArray arr={value} name={name} onChange={onChangeHandler} />}
            {schemaType === 'hash' && <InputHash hash={value} name={name}  />}
            {schemaType === 'number' && <InputNumber value={value} name={name} onChange={onChangeHandler} />}
            {schemaType === 'string' && <InputString value={value} name={name} onChange={onChangeHandler} />}
            {schemaType === 'boolean' && <InputBoolean value={value} name={name} onChange={onChangeHandler} />}
        </div>
    );
};