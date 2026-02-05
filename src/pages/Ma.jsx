import React from 'react'
import { socket } from '../socket.js'
import ConnectionManager from '../component/socket/ConnectionManager.jsx';
import ConnectionState from '../component/socket/ConnectionState.jsx';
import Events from '../component/socket/Events.jsx';
import MyForm from '../component/socket/MyForm.jsx';
import { useState } from 'react';
import { useEffect } from 'react';
const Ma = () => {
    const [isConnected, setisConnected] = useState(false)
    const [fooEvent, setFooEnvent] = useState([])

    useEffect(()=>{
        function onCennect(){
            setisConnected(true)
        }
        function onDisconnect(){
            setisConnected(false)
        }
        function onFooEvent(data){
            setFooEnvent((prev)=>[...prev,data])
        };
        socket.on("connect", onCennect)
        socket.on("disconnect", onDisconnect)
        socket.on("foo-event", onFooEvent)
        return ()=>{
            socket.off("connect", onCennect)
            socket.off("disconnect", onDisconnect)
            socket.off("foo-event", onFooEvent)
        }
    },[])
  return (
    <div>
        
        <ConnectionState isConnected={isConnected} />
        <Events events={fooEvent} />
        <ConnectionManager />
        <MyForm />
    </div>
  )
}

export default Ma