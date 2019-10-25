import React,{ useEffect, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import Logo from '../Img/Log.png'
import { Header, Icon } from 'react-native-elements'
import Geolocalization from 'react-native-geolocation-service'
import AsyncStorage from '@react-native-community/async-storage'
import firebase from 'firebase'

const Option = ({navigation})=>{
    const [ latitude, setLatitude ] = useState('')
    const [ longitude, setLongitude ] = useState('')

    useEffect(()=>{
        handlerLocation()
    },[])
    async function handlerLocation(){
        try{
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
        catch(err){

        }
    }
    function handleMain(){
        return(
            <TouchableOpacity onPress={()=> navigation.navigate('Home')}>
                <Icon
                size={30}
                containerStyle={{marginBottom:25}}
                name='home'
                />
            </TouchableOpacity>
        )
    }
    function handleExit(){
        return(
            <TouchableOpacity onPress={()=> ExitApp()}>
                <Icon
                size={30}
                containerStyle={{marginBottom:25}}
                name='exit-to-app'
                />
            </TouchableOpacity>
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
            <View style={{flex:1,alignSelf:'stretch' }}>
                <Header
                containerStyle={{backgroundColor:'#3B5998', height: 50}}
                leftComponent={()=> handleMain()}
                rightComponent={()=> handleExit()}
                />
            </View>
            <View style={{flex:9,alignSelf:'stretch', alignItems:'center',justifyContent:'center'}}>
                <Text style={styles.txt}>Ola! oque você está querendo?</Text>
                <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Maps', {latitude: latitude, longitude: longitude })}>
                    <Text style={styles.textBtn}>anunciar um imovél</Text>
                </TouchableOpacity>
                    <Text style={styles.or}>Ou</Text>
                <TouchableOpacity  style={styles.btn} onPress={()=> navigation.navigate('MapStore', { latitude: latitude, longitude: longitude})}>
                    <Text style={styles.textBtn}>buscar um imovél</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        justifyContent:'center',
        alignItems:'center'
    },
    btn:{
        borderRadius: 50,
        alignSelf:'stretch',
        marginLeft: 16,
        marginRight: 16,
        height: 45,
        justifyContent:'center',
        borderRadius: 4,
        backgroundColor: '#3B5998',
        height: 41
    },
    textBtn:{
        color: '#1A1A1A',
        textTransform: 'uppercase',
        fontWeight:'bold',
        textAlign:'center'
    },
    or:{
        textAlign: 'center',
        color:'#1A1A1A',
        margin: 20,
        textTransform:"uppercase"
    },
    Logo:{
        width: 80,
        height: 80,
        marginTop: 50,
        marginBottom: 80
    },
    txt:{
        margin: 18,
        fontSize:14,
        textAlign:'center',
        color:'#1A1A1A',
    }
})
export default Option