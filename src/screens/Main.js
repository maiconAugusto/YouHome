import React, { useState, useEffect} from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text, AsyncStorage, BackHandler } from 'react-native'
import Maps from '../Img/map.png'
import Startup from '../Img/startup.png'
import Config from '../Img/config.png'
import Edit from '../Img/edit.png'
import Geolocalization from 'react-native-geolocation-service'
import Logo from '../Img/Log.png'
import firebase from 'firebase'

const Main = ({navigation})=>{
    const [ latitude, setLatitude ] = useState('')
    const [ longitude, setLongitude ] = useState('')

    useEffect(()=>{
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
    return(
        <View style={styles.container}>
            <View style={{alignItems:'center'}}>
                <Image source={Logo} style={styles.Logo}/>
                <Text style={styles.welcome}>bem-vindo</Text>
            </View>
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
                    <View style={styles.section}>
                        <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('MyHomes')}>
                            <Image style={[styles.icons,{marginLeft: 11}]} source={Edit}/>
                            <Text style={styles.txt}>Minhas publicações</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Config')}>
                            <Image style={styles.icons} source={Config}/>
                            <Text style={styles.txt}>Editar usuário</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex :1,
        backgroundColor:'#3B5998'
    },
    icons:{
        height:70,
        width: 70
    },
    ar:{
       flex: 2,
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
        backgroundColor: '#F2F4F4',
        height: 130,
        width: 130,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#1A1A1A'
    },
    Logo:{
        width: 70,
        height: 70,
        marginTop:16
    },
    welcome:{
        fontWeight:'bold',
        color: '#1A1A1A',
        fontSize: 14,
        textTransform:'uppercase'
    },
    txt:{
        textAlign:'center',
        marginTop: 8,
        fontSize:12,
        textTransform:'uppercase'
    }
})
export default Main