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
    async function ExitApp(){
        try{
            const response = await AsyncStorage.removeItem('@Email_Key')
                .then(()=>{
                    firebase.auth().signOut()
                        .then(()=>{
                            navigation.goBack()
                        })
                })
        }
        catch(err){

        }
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
                            <Text style={styles.txt}>Publicar imovél</Text>
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
                            <Text style={styles.txt}>Minhas publicação</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Config')}>
                            <Image style={styles.icons} source={Config}/>
                            <Text style={styles.txt}>Editar usuário</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.container_exit}>
                        <TouchableOpacity onPress={()=> ExitApp()}>
                            <Text style={styles.exit}>sair</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex :1,
        backgroundColor:'#1A1A1A'
    },
    icons:{
        height:70,
        width: 70
    },
    ar:{
       flex: 1,
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
        height: 150,
        width: 150,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#28EDE7'
    },
    Logo:{
        width: 70,
        height: 70,
        marginTop:16
    },
    welcome:{
        fontWeight:'bold',
        color: '#28EDE7',
        fontSize: 14,
        textTransform:'uppercase'
    },
    txt:{
        textAlign:'center',
        marginTop: 8,
        fontSize:12,
        textTransform:'uppercase'
    },
    exit:{
        color: '#28EDE7',
        textTransform:  'uppercase',
        fontWeight:'bold',
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 12,
        paddingBottom: 12,
        borderColor: '#28EDE7',
        borderWidth: 1.8,
        borderRadius: 50,
        borderBottomWidth: 5,
    },
    container_exit:{
        marginTop: 16,
        flexDirection:'row', 
        alignItems:'center',
        justifyContent:"center"
    }
})
export default Main