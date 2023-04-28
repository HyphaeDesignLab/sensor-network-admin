import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

import Embed from './Embed';

const Embedder = ({firebaseApp}) => {
    const [embeds, setEmbeds] = useState([]);
    const [embedsError, setEmbedsError] = useState(false);
    const [isEmbedsLoading, setEmbedsLoading] = useState(false);
    const [currentEmbed, setCurrentEmbed] = useState(null);


    useEffect(() => {
        setEmbedsLoading(true);
        initEmbeds()
            .finally(() => {
                setEmbedsLoading(false);
            });
    }, []);

    const initEmbeds = () => {
        return new Promise((resolve, reject) => {
            const listRef = collection(firebaseApp.db, "echart_embeds");
            getDocs(listRef)
                .then(querySnapshot => {
                    let list = [];
                    querySnapshot.forEach((doc) => {
                        let docData = doc.data();
                        docData.id = doc.id;
                        docData.time_start = docData.time_start.toDate();
                        docData.time_end = docData.time_end.toDate();
                        list.push(docData);
                    })
                    setEmbeds(list);
                    resolve();
                })
                .catch((error) => {
                    if (error.code === 'permission-denied') {
                        setEmbedsError('You must have privilidges to access embeds list');
                    } else {
                        setEmbedsError(error.message);
                    }
                    reject();
                });
        });
    };


    const addEmbed = (embed) => {
        addDoc(collection(firebaseApp.db, "echart_embeds"), embed).then(docRef => {
            embed.id = docRef.id;
            setEmbeds([...embeds, embed]);
            setCurrentEmbed(embed);
        }).catch(e => {
            console.error("Error adding embed", e);
        }).finally(() => {
        });
    }

    const deleteEmbed = (id) => {
        if (!window.confirm(`Are you certain you want to delete embed: ${embeds.find(embed => embed.id === id).name} ?`)) {
            return;
        }

        deleteDoc(doc(firebaseApp.db, "echart_embeds", id))
            .then(() => {
                setEmbeds(embeds.filter(p => p.id !== id));
            })
            .catch((error) => {
                console.log('Error deleting embed', error);
            })
            .finally(() => {
                setCurrentEmbed(null); // in case we were editing; let's set current to none after delete
            })

    }

    const saveEmbed = (embedFragment) => {
        if (!currentEmbed) {
            return;
        }

        if (!currentEmbed.id) {
            addEmbed(embedFragment);
            return;
        }

        const docRef = doc(firebaseApp.db, "echart_embeds", currentEmbed.id);
        return updateDoc(docRef, embedFragment)
            .then(response => {
                const embedsCopy = [...embeds];
                const index = embedsCopy.findIndex(p => p.id === currentEmbed.id);
                embedsCopy[index] = {...currentEmbed, ...embedFragment};
                setEmbeds(embedsCopy);
                setCurrentEmbed(embedsCopy[index]);
            })
            .catch(error => {
                console.log('embed update error ', error.message);
            });
    }


    const editEmbed = (embed, e) => {
        e.preventDefault();

        if (!!currentEmbed && currentEmbed.id === embed.id) {
            return;
        }
        setCurrentEmbed(embed);
    }


    const handleAddEmbed = (e) => {
        e.preventDefault();

        setCurrentEmbed({});
    }


    return <section>
        <h2>Embeds</h2>
        {isEmbedsLoading && <div className='spinning-loader'></div>}
        {!!embedsError && <div>{embedsError}</div>}
        {embeds.map(embed =>
            <div className='embed' key={embed.id}>
                <a href='#edit' onClick={e => editEmbed(embed, e)}>{embed.name} ({embed.type}, {embed.data_type})</a>
                {!!currentEmbed && currentEmbed.id === embed.id && <div>
                <Embed model={currentEmbed} onChange={saveEmbed}/>
                </div>}
            </div>
        )}
        <div>
            <button className='link' onClick={handleAddEmbed}>+ Add Embed</button>
            <EmbedCreator />
        </div>
    </section>;

    //https://sensordashapi.hyphae.net:3001/sensors/readings?field=globe_temperature&type=globetemp
};

export default Embedder;
