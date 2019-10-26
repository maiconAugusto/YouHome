import React,{ useEffect, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import { Header, Icon } from 'react-native-elements'
import Geolocalization from 'react-native-geolocation-service'
import AsyncStorage from '@react-native-community/async-storage'
import firebase from 'firebase'
import search from '../Img/search.png'

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
    return(
        <View style={styles.container}>
            <View style={{flex:9,alignSelf:'stretch', alignItems:'center',justifyContent:'center'}}>
                <View style={{flex: 1, justifyContent:'center'}}>
                    <Image style={{width: 100, height: 100 }} source={search}/>
                </View>
                <View style={{flex: 2, alignSelf:'stretch'}}>
                    <Text style={styles.txt}>Ola! oque você está querendo?</Text>
                    <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Maps', {latitude: latitude, longitude: longitude })}>
                        <Text style={styles.textBtn}>anunciar um imovél</Text>
                    </TouchableOpacity>
                        <Text style={styles.or}>ou</Text>
                    <TouchableOpacity  style={styles.btn} onPress={()=> navigation.navigate('MapStore', { latitude: latitude, longitude: longitude})}>
                        <Text style={styles.textBtn}>procurar um imovél</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#1A1A1A',
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
        backgroundColor: '#7966FF',
        height: 41
    },
    textBtn:{
        color: '#FFFFFF',
        textTransform: 'uppercase',
        fontWeight:'bold',
        textAlign:'center'
    },
    or:{
        textAlign: 'center',
        color:'#FFFFFF',
        margin: 20,
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
        color:'#FFFFFF',
    }
})
export default Option