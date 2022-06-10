import React, {useState, useEffect} from 'react';
import ImageInput from "./ImageInput";

const SensorPhotos = ({photos, onUpdated}) => {
    const [isAddNew, setAddNew] = useState(false);
    const handleNewPhotoLoaded = photo => {
        setAddNew(false);
        if (!photos) {
            onUpdated([photo]);
        } else {
            onUpdated([...photos, photo]);
        }
    };
    const handleAddNewClick = () => {
        setAddNew(true);
    };

    const handleDeleteClick = (i) => {
        const updatedPhotos = photos.filter((photo, j) => i !== j);
        onUpdated(updatedPhotos);
    };

    return <div>
        {!!photos && photos.map((photo, i) => <div>
            <img src={photo} key={i} /> <button onClick={handleDeleteClick.bind(null, i)}>x</button>
        </div>)}
        <div><button onClick={handleAddNewClick} disabled={isAddNew}>Add New</button></div>
        {isAddNew && <ImageInput onLoaded={handleNewPhotoLoaded} />}
    </div>;
};

export default SensorPhotos;