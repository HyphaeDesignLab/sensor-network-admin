import React, {useState, useEffect} from 'react';
import InputDate from "../../components/InputDate";


const App = () => {
    const [date, setDate] = useState(new Date());
    const onSave = fragment => {
        setDate(fragment['date']);
    }
    return (
        <InputDate path='date' value={date} onSave={onSave}/>
    );
};

export default App;
