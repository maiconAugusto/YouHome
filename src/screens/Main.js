import React, { useState, useEffect} from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native'
import Maps from '../Img/map.png'
import Startup from '../Img/startup.png'
import Config from '../Img/config.png'
import Edit from '../Img/edit.png'
import Geolocalization from 'react-native-geolocation-service'
import firebase from 'firebase'
import AsyncStorage from '@react-native-community/async-storage'
import base64 from 'base-64'


const Main = ({navigation})=>{
    const [ latitude, setLatitude ] = useState('')
    const [ longitude, setLongitude ] = useState('')
    const [ emailUser, setEmailUser ] = useState('') 

    useEffect(()=>{
        const response =  AsyncStorage.getItem('@Email_Key').then((response)=>{
            setEmailUser(base64.encode(response))
        })
        handlerLocation()
    },[])
    async function handlerLocation(){
        const response = await Geolocalization.getCurrentPosition(
            (position)=>{
                const{ latitude, longitude } = position.coords
                    setLatitude(latitude)
                        setLongitude(longitude)
            },
            (err)=>{
                setLatitude(-18.5128863)
                setLongitude(-54.0721161)
            }
        )
    }
    async function ExitApp(){
        try{
            const response = await AsyncStorage.removeItem('@Email_Key')
                .then(()=>{
                    firebase.auth().signOut()
                        .then(()=>{
                            navigation.navigate('Login')
                        })
                })
        }
        catch(err){

        }
    }
    return(
        <View style={styles.container}>
            <View style={styles.ar}>
                    <View style={styles.section}>
                        <TouchableOpacity style={styles.btn} 
                        onPress={()=> navigation.navigate('Maps', { latitude: latitude, longitude: longitude})}>
                            <Image style={styles.icons} source={Maps}/>
                            <Text style={styles.txt}>anunciar imovél</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btn}
                        onPress={()=> navigation.navigate('MapStore', { latitude: latitude, longitude: longitude})}>
                            <Image style={styles.icons} source={Startup}/>
                            <Text style={styles.txt}>Buscar imovél</Text>
                        </TouchableOpacity>
                    </View>            
                    <View style={[styles.section,{marginBottom:30}]}>
                        <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('MyHomes',{emailUser: emailUser})}>
                            <Image style={[styles.icons,{marginLeft: 11}]} source={Edit}/>
                            <Text style={styles.txt}>meus anuncios</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Config')}>
                            <Image style={styles.icons} source={Config}/>
                            <Text style={styles.txt}>dados pessoais</Text>
                        </TouchableOpacity>
                    </View>
            </View>
                    <View style={{flex: 0.6, flexDirection:"row",justifyContent:'center',alignItems:'center'}}> 
                        <TouchableOpacity onPress={()=> ExitApp()}>
                            <Text style={styles.exit}>Sair</Text>
                        </TouchableOpacity>
                    </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex :1,
        backgroundColor:'#1A1A1A',
        flexDirection:'column'
    },
    icons:{
        height:70,
        width: 70
    },
    ar:{
       flex: 3,
       marginTop: 80,
        justifyContent:'center',
    },
    section:{
        justifyContent:'space-evenly',
        flexDirection: 'row',
        marginBottom: 30,
    },
    btn:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
        height: 130,
        width: 130,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#1A1A1A'
    },
    Logo:{
        width: 70,
        height: 70,
        marginTop:16
    },
    txt:{
        textAlign:'center',
        marginTop: 8,
        fontSize:12,
        textTransform:'uppercase'
    },
    exit:{
        color: '#7966FF',
        textTransform:  'uppercase',
        fontWeight:'bold',
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 12,
        paddingBottom: 8,
        borderColor: '#7966FF',
        borderWidth: 1.8,
        borderBottomWidth: 5,
        borderRadius: 50,
        marginBottom: 20,
        fontSize: 13
    }
})
export default Main