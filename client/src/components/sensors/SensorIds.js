import React, {useState, useEffect} from 'react';
import SensorOcrParser from "./SensorOcrParser";
import InputString from "../InputString";


const sensorIdProps = {
    deveui: {title: 'Dev EUI'},
    appeui: {title: 'App EUI'},
    appkey: {title: 'App Key'}
};
const sensorIdKeys = Object.keys(sensorIdProps);

const SensorIds = ({ids, onSave, headingLevel=3}) => {
    const Hx = 'h'+headingLevel;
    const [ids_, setIds] = useState(null);

    const areAllIdsSet = ids => {
      return sensorIdKeys.every(id => !!ids[id]);
    };
    const onEditSaved = (idsFragment) => {
        const newIds = {...ids_, ...idsFragment};
        setIds(newIds);
        onSave(newIds, areAllIdsSet(newIds));
    };

    const onOcrConfirmed = (ids__) => {
        setIsManualEntry(true);
        setIds(ids__);
        onSave(ids__, areAllIdsSet(ids__));
    };

    useEffect(() => {
        if (!!ids) {
            setIds(ids);
        }
    }, [ids]);

    const onOcrEditCancel = () => {
        setIsManualEntry(null);
    };

    const [isManualEntry, setIsManualEntry] = useState(true);

    const inputStringStyle = {
        padding: '5px',
        fontFamily: 'monospace, sans-serif',
        letterSpacing: '3px'
    };

    return <div>
        <div>
            <button type='button' className='link' onClick={() => setIsManualEntry(false)} disabled={isManualEntry === false}>Scan from Photo</button>&nbsp;
            {!isManualEntry && <button type='button' className='link' onClick={() => setIsManualEntry(true)} >cancel</button>}
        </div>
        {isManualEntry === false &&
            <SensorOcrParser onConfirm={onOcrConfirmed} onCancel={onOcrEditCancel} headingLevel={headingLevel}/>
        }

        {isManualEntry !== false &&
            <React.Fragment>
                {Object.keys(sensorIdProps).map(sensorId =>
                    <div key={sensorId}>
                        <span>{sensorIdProps[sensorId].title}</span>:
                        {isManualEntry === false ?
                            <span style={inputStringStyle}>{ids_[sensorId]}</span> :
                            <InputString path={sensorId} value={ids_ ? ids_[sensorId] : ''}
                                     type={'text'} onSave={onEditSaved} hasLabel={false}
                                     isOnlyEditMode={!ids_ || !ids_[sensorId]} inputStyle={inputStringStyle} wrapEl='span'
                            />
                        }
                    </div>)}
            </React.Fragment>}
    </div>;
};

export default SensorIds;