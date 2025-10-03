import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function StudentInfoEdit({ navigation }) {
  return (
    <View style={s.c}>
      <Text style={s.t}>Información de Alumno (stub)</Text>
      <TouchableOpacity style={s.btn} onPress={() => navigation.goBack()}>
        <Text style={s.bt}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  c:{flex:1,justifyContent:'center',alignItems:'center',padding:20,backgroundColor:'#fff'},
  t:{fontSize:22,fontWeight:'bold',marginBottom:16},
  btn:{backgroundColor:'#8B2D2D',paddingVertical:12,paddingHorizontal:24,borderRadius:8},
  bt:{color:'#fff',fontWeight:'bold'}
});
