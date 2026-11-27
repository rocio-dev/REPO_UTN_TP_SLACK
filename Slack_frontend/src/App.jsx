import React from "react";
import { Route, Routes } from "react-router";
import HomeScreen from "./Screens/HomeScreen/HomeScreen";
import LoginScreen from "./Screens/LoginScreen/LoginScreen";
import RegistroScreen from "./Screens/RegistroScreen/ResgistroScreen";

export const App =() =>{
  return (
    <Routes>
      <Route path="/" element= {<HomeScreen/>}/>
      <Route path="/login" element= {<LoginScreen/>}/>
      <Route path="/registrarse" element= {<RegistroScreen/>}/>
    </Routes>
  )
}

export default App