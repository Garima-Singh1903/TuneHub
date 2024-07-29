import { createContext, useEffect, useRef, useState } from "react";
import axios from 'axios';

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioref = useRef();
    const seekBg = useRef();
    const seekBar = useRef();
    const url = 'http://localhost:4000';
    const [songsData, setSongsData] = useState([]);
    const [albumsData, setAlbumsData] = useState([]);
    const [track, setTrack] = useState(songsData[1]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    });

    const play = () => {
        audioref.current.play();
        setPlayStatus(true);
    }

    const pause = () => {
        audioref.current.pause();
        setPlayStatus(false);
    }
        
    const playWithId = async (id) => {
       
      await songsData.map((item)=>{
        if(id === item._id)
        {
          setTrack(item);
        }
      })
      await  audioref.current.play();
      setPlayStatus(true);
    }

    const previous = async () => {
        songsData.map(async (item,index)=>{

          if(track._id === item._id && index>0)
          {
            await setTrack(songsData[index-1]);
            await audioref.current.play();
            setPlayStatus(true);
          }
        })
    }

    const next = async () => {
      songsData.map(async (item,index)=>{

        if(track._id === item._id && index<songsData.length)
        {
          await setTrack(songsData[index+1]);
          await audioref.current.play();
          setPlayStatus(true);
        }
      })
    }

    const seekSong = async (e) => {
        audioref.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioref.current.duration);
    }

    const getSongsData = async () => {
        try {
            const response = await axios.get(`${url}/api/song/list`);
            setSongsData(response.data.songs);
            setTrack(response.data.songs[0]);
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    }

    const getAlbumsData = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`);
            setAlbumsData(response.data.albums);
        } catch (error) {
            console.error('Error fetching albums:', error);
        }
    }

    useEffect(() => {
        const handleTimeUpdate = () => {
            if (audioref.current) {
                seekBar.current.style.width = (Math.floor(audioref.current.currentTime / audioref.current.duration * 100)) + "%";
                setTime({
                    currentTime: {
                        second: Math.floor(audioref.current.currentTime % 60),
                        minute: Math.floor(audioref.current.currentTime / 60)
                    },
                    totalTime: {
                        second: Math.floor(audioref.current.duration % 60),
                        minute: Math.floor(audioref.current.duration / 60)
                    }
                });
            }
        };

        if (audioref.current) {
            audioref.current.ontimeupdate = handleTimeUpdate;
        }

        return () => {
            if (audioref.current) {
                audioref.current.ontimeupdate = null;
            }
        };
    }, [audioref]);

    useEffect(() => {
        getSongsData();
        getAlbumsData();
    }, []);

    const contextValue = {
        audioref,
        seekBar,
        seekBg,
        track, setTrack,
        playStatus, setPlayStatus,
        time, setTime,
        play, pause,
        playWithId,
        previous, next,
        seekSong,
        albumsData, songsData
    }

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider;
