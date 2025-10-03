import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

export default function Home({ navigation }) {
  const logout = async () => {
    try { await signOut(auth); }
    catch { Alert.alert('Error','No se pudo cerrar sesión'); }
  };
  return (
    <View style={s.c}>
      <Text style={s.t}>ISDM – Portal de Alumnos</Text>
      <TouchableOpacity style={s.btn} onPress={() => navigation.navigate('ProfileEdit')}>
        <Text style={s.bt}>Gestionar Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.btn} onPress={() => navigation.navigate('StudentInfoEdit')}>
        <Text style={s.bt}>Información de Alumno</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[s.btn,{opacity:.9}]} onPress={logout}>
        <Text style={s.bt}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
const s=StyleSheet.create({
  c:{flex:1,justifyContent:'center',padding:20,backgroundColor:'#fff'},
  t:{fontSize:22,fontWeight:'bold',textAlign:'center',marginBottom:24},
  btn:{backgroundColor:'#8B2D2D',paddingVertical:12,borderRadius:8,marginBottom:12},
  bt:{color:'#fff',textAlign:'center',fontWeight:'bold'}
});
