import React, { useContext, useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import { PlayerContext } from '../context/PlayerContext';

const DisplayAlbum = () => {
    const { id } = useParams();
    const [albumData, setAlbumData] = useState(null);
    
    const { playWithId, albumsData, songsData } = useContext(PlayerContext);

    useEffect(() => {
        console.log('Albums Data:', albumsData);
        console.log('Songs Data:', songsData);

        if (Array.isArray(albumsData)) {
            const album = albumsData.find((item) => item._id === id);
            if (album) {
                console.log('Found Album:', album);
                setAlbumData(album);
            } else {
                console.log('Album not found for ID:', id);
            }
        }
    }, [id, albumsData]);

    if (!albumData) {
        return <div>Loading...</div>; // Or another placeholder
    }

    const filteredSongs = songsData.filter((item) => item.album === albumData.name);

    return (
        <>
            <Navbar />
            <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
                <img className="w-48 rounded" src={albumData.image} alt={albumData.name} />
                <div className='flex flex-col'>
                    <p>Playlist</p>
                    <h2 className="text-5xl font-bold mb-4 md:text-7xl">{albumData.name}</h2>
                    <h4>{albumData.desc}</h4>
                    <p className="mt-1">
                        <img className="inline-block w-5" src={assets.spotify_logo} alt="Spotify Logo" />
                        <b>TuneHub</b>
                        . 1,323,154 likes
                        . <b>50 songs,</b>
                        about 2 hr 30 min
                    </p>
                </div>
            </div>

            <div className='grid grid-cols-4 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7] '>
                <p><b className='mr-4'>#</b>Title</p>
                <p>Album</p>
                <p className='hidden sm:block'>Date Added</p>
                <img className='m-auto w-4' src={assets.clock_icon} alt="Clock Icon" />
            </div>

            <hr />

            {filteredSongs.length > 0 ? (
                filteredSongs.map((item, index) => (
                    <div
                        key={item._id}
                        onClick={() => playWithId(item._id)}
                        className='grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] cursor-pointer hover:bg-[#ffffff2b]'
                    >
                        <p className='text-white'>
                            <b className='mr-4 text-[#a7a7a7]'>{index + 1}</b>
                            <img className='inline w-10 mr-5' src={item.image} alt={item.name} />
                            {item.name}
                        </p>
                        <p className='text-[15px]'>{albumData.name}</p>
                        <p className='text-[15px] hidden sm:block'>5 days ago</p>
                        <p className='text-[15px] text-center'>{item.duration}</p>
                    </div>
                ))
            ) : (
                <p>No songs available for this album.</p>
            )}
        </>
    );
}

export default DisplayAlbum;
