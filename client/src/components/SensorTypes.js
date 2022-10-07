import React, {useState, useEffect} from 'react';
import {setDoc, doc, collection, getDocs} from "firebase/firestore";
import InputString from "./InputString";

const SensorTypes = ({title, firebaseApp, onUpdate}) => {
    const [isLoading, setLoading] = useState(false);
    const [types, setTypes] = useState([]);
    const [tempType, setTempType] = useState({});
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        const sensorTypesRef = collection(firebaseApp.db, "sensor_types");
        getDocs(sensorTypesRef)
            .then(querySnapshot => {
                let typesArr = [];
                querySnapshot.forEach((doc) => {
                    let type = doc.data();
                    type.id = doc.id;
                    typesArr.push(type);
                })
                setTypes(typesArr);
            })
            .catch((error) => {
                if (error.code === 'permission-denied') {
                    setError('You must have privilidges to access sensor types');
                } else {
                    setError(error.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        onUpdate(types);
    }, [types]);

    const [isShowAddNewType, setShowAddNewType] = useState(false);
    const [isSavingNewType, setSavingNewType] = useState(false);
    const [addNewError, setAddNewError] = useState(false);

    const handleSaveTempType = (fragment) => {
        if (Object.keys(fragment)[0] === 'id') {
            fragment.id = fragment.id.replace(/[^\w]+/g, '').toLowerCase();
        }
        setTempType({...tempType, ...fragment});
    }

    const handleSaveNewType = () => {
        if (!tempType.id || !tempType.name || !tempType.description) {
            setError('A type needs ID, name and description');
            return;
        }
        setSavingNewType(true);
        addType(tempType);
    };

    const addType = (type) => {
        setAddNewError(false);
        if (types.some(typeI => typeI.id === type.id)) {
            setAddNewError(`You cannot add another type; the type "${type.id}" is already in use`);
            setSavingNewType(false);
            return;
        }
        setDoc(doc(firebaseApp.db, 'sensor_types', type.id), type).then(() => {
            setTypes([...types, type]);
        }).catch(e => {
            setAddNewError(`Error adding project: ${e.message}`);
        }).finally(() => {
            setSavingNewType(false);
            setTempType({});
            setShowAddNewType(false);
        });
    };

    const handleUpdateType = (id, typeFragment) => {
        setDoc(doc(firebaseApp.db, 'sensor_types', id), typeFragment, { merge: true }).then(() => {
            setTypes(types.map(type => type.id !== id ? type : {...type, ...typeFragment}));
        }).catch(e => {
            setError(`Error updating project: ${e.message}`);
        }).finally(() => {

        });
    };

    return <section>
        {title}
        {!!error && <div className={'error'}>{error}</div>}
        {isLoading && <div className='spinning-loader'></div>}

        <p>
            NOTE: the internal ID is used for the AWS IOT topics that consumer-clients subscribe to.<br/>
            Talk to admin if you need changes or create a new sensor TYPE with the appropriate ID
        </p>

        {Boolean(types.length) && types.map(type =>
            <div key={type.id} style={{margin: '20px 10px'}}>
                <div><InputString value={type.name} path='name' hasLabel={false} wrapEl='strong' onSave={typeFragment => handleUpdateType(type.id, typeFragment)} /> (Internal ID: {type.id})</div>
                <div><InputString value={type.description} path='description' wrapEl='span' onSave={typeFragment => handleUpdateType(type.id, typeFragment)} /></div>
            </div>
        )}
        {isShowAddNewType ? <div>
            <h3>New Type</h3>
            <div>
                <strong>Internal ID: </strong>
                <InputString value={tempType.id??''} path='id' hasLabel={false} onSave={handleSaveTempType} wrapEl='span' />
            </div>
            <div>
                <strong>Name: </strong>
                <InputString value={tempType.name??''} path='name' hasLabel={false} onSave={handleSaveTempType} wrapEl='span' />
            </div>
            <div>
                <strong>Description: </strong>
                <InputString value={tempType.description??''} path='description' hasLabel={false} onSave={handleSaveTempType} wrapEl='span' />
            </div>
            <button type='button' className='link' onClick={handleSaveNewType} disabled={(!tempType.id || !tempType.name || !tempType.description) || isSavingNewType}>Save</button>
            {!!addNewError && <div className={'error'}>{addNewError}</div>}
            {isSavingNewType && <div className='spinning-loader'></div>}
        </div>
        :
        <div>
            <button type='button' className='link' onClick={() => setShowAddNewType(true)}>(+) Add New Type</button>
        </div>}

        {!types.length && <div>No types yet</div>}

            {/*<option value='temphum_dragino_sm31'>temp+hum (dragino sm31)</option>*/}
            {/*<option value='mrt_dragino_d22'>MRT+temp (dragino d22)</option>*/}
            {/*<option value='wind_barani_meteowind_iot_pro'>Wind (Barani MeteoWind IOT Pro)</option>*/}
            {/*<option value='temphum_dragino_lht65'>temp+hum indoor (dragino lht65)</option>*/}
    </section>;
};

export default SensorTypes;