import React, { useState, useEffect } from 'react';

const AddProject = ({ setStep, setCurrentProject, addProject }) => {

  const [name, setname] = useState('');
  const [description, setdescription] = useState('');

  const handleChange = e => {
    if (e.target.name === 'name') {
      setname(e.target.value);
    } else {
      setdescription(e.target.value);
    }
  }

  const handleKeyUp = e => {
    if (e.code === 'Escape') {
        resetValue();
    }
  }

  const handleSave = () => {
    setCurrentProject({name, description});
    addProject({name, description});
    setStep('project');
  }

  return <div>
    <strong>Project Name:</strong>
    <input name={'name'} onChange={handleChange} onKeyUp={handleKeyUp}></input>
    <strong>Project Description:</strong>
    <input name={'description'} onChange={handleChange} onKeyUp={handleKeyUp}></input>
    <button onClick={handleSave}>Save</button>
    <button onClick={setStep.bind(null, 'projects')}>Cancel</button>
    </div>
}

export default AddProject;