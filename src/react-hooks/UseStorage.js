import React, { useState, useCallback } from 'react';

const useStorage = (key, defaultVale, keepOnWindowClosed)=>{
  const storage = keepOnWindowClosed ? localStorage : sessionStorage;
  const getStorageValue = ()=>{
    try{
      const storageValue = storage.getItem(key);
      if(storageValue !== null){
        return JSON.parse(storageValue);
      }else if(defaultVale){
        const value = typeof defaultVale === "function" ? defaultVale() : defaultVale;
        storage.setItem(key, JSON.stringify(value))
        return value
      }
    }catch{
      console.warn("有毛病了");
    }

    return undefined;
  }

  const [value, setValue] = useState(getStorageValue);

  const save = useCallback((value)=>{
    setValue(prev =>{
      const finalValue = typeof value === "function" ? value(prev) : value;
      storage.setItem(key, JSON.stringify(finalValue));
      return finalValue;
    })
  }, [])

  const clear = useCallback(()=>{
    storage.removeItem(key);
    setValue(undefined);
  }, [])

  return[ value, save, clear ];
}

export default ()=>{
  const [user, setUser, clearUser] = useStorage("user", "xiaoming");
  const login = (name)=>{
    setUser(name);
  }

  const logout = ()=>{
    clearUser()
  }

  return(
    <>
      <button onClick={()=>login("xioahong")}>login</button>
      <button onClick={logout}>logout</button>
    </>
  )
}