import React, {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const config = {
    style: { required: true, pattern: /^mapbox:\/\/styles\/.+/ }, // mapbox://styles/username/idASDASDSDA",
    zoom: { required: true, valueAsNumber: true, min: 1, max: 20},
    text: { required: false}
};

const App = () => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(d => console.log(d))}>
            <input {...register("style", config['style'])} />
            <input type="number" {...register("zoom", config['zoom'])} />
            <input  {...register("text", config['text'])} />
            <input type="submit" />
        </form>
    );
};

export default App;
