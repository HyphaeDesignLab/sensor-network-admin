import React, {useState, useEffect} from 'react';
import ImageInput from "./ImageInput";

const SensorPhotos = ({photos, onUpdated}) => {
    const [error, setError] = useState(false);
    const [isSaving, setSaving] = useState(false);
    const [newPhoto, setNewPhoto] = useState(null);
    const handleNewPhotoLoaded = photo => {
        setNewPhoto(photo);
    };

    let wasAddClicked = false; // double-click protection
    const handleAddClick = () => {
        if (wasAddClicked) {
            return;
        }
        wasAddClicked = true;
        setSaving(false);
    };

    let wasSaveClicked = false; // double click protection
    const handleNewPhotoSave = () => {
        if (wasSaveClicked) {
            return;
        }
        wasSaveClicked = true;

        setSaving(true);
        onUpdated(!photos ? [newPhoto] : [...photos, newPhoto])
            .then(() => {
                setSaving(false);
                setNewPhoto(null);
            })
            .catch(e => {
                setError(e.message);
            });
    };
    const handleNewPhotoCancel = () => {
        setNewPhoto(null);
    };

    const handleDeleteClick = (i) => {
        const updatedPhotos = photos.filter((photo, j) => i !== j);
        onUpdated(updatedPhotos);
    };

    return <div>
        {!!error && <div style={{color: 'red'}}>Error: {error}</div>}
        {!!photos && photos.map((photo, i) => <div key={photo.slice(3000,3100)}>
            <img src={photo} /> <button onClick={handleDeleteClick.bind(null, i)}>x</button>
        </div>)}
        {!newPhoto ?
            <div>
                <ImageInput onLoaded={handleNewPhotoLoaded} label='Add Photo' fitToBox={{width: 600, height: 600}} /> <a href='#' onClick={handleNewPhotoCancel}>cancel</a>
            </div>
            :
            <div>
                <img src={newPhoto} style={{width: '200px'}} />
                {!isSaving ?
                    <span><a href='#' onClick={handleNewPhotoSave}>Save</a> <a href='#' onClick={handleNewPhotoCancel}>cancel</a></span>
                    :
                    <span>saving...</span>}
            </div>
        }
    </div>;
};

export default SensorPhotos;