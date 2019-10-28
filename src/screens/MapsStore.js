import React,{ useState, useEffect } from 'react'
import  MapView  from 'react-native-maps'
import { Marker, Circle } from 'react-native-maps'
import { View, StyleSheet } from 'react-native'
import firebase from 'firebase'

const MapsStore = ({navigation})=>{
    const [ coordinate, setCordinates ] = useState([])

    useEffect(()=>{
        handlePost()
    },[])
    
    async function handlePost(){
        const response = await firebase.database().ref('/Posts/')
            .on('value',snapshot=>{
                if(snapshot.val() == null){
                    return 
                }
                setCordinates(Object.values(snapshot.val()))
            })
    }

    function handleMarker(){
        const Markers = coordinate.map(function(element){
            if(element.stateOfHouse == false ){
                return(
                    <Marker
                    key={element.latitude}
                    pinColor="red"
                    title={element.home}
                    description={`Não está disponível`}
                    coordinate={{
                    latitude: element.latitude,
                    longitude: element.longitude,
                    latitudeDelta:0,
                    longitudeDelta:0
                    }}
                    />)
            }
            if(element.stateOfHouse == true){
                return(
                    <Marker
                    onPress={()=> navigation.navigate('InfoHome',{
                    userId: element.userId, storage: element.storage, 
                    home: element.home, price: element.price, space: element.space,
                    latitude: element.latitude, longitude: element.longitude,
                    latitudeUser: navigation.getParam('latitude'), longitudeUser: navigation.getParam('longitude')
                    }
                    )}
                    key={element.latitude}
                    pinColor="green"
                    title={element.home}
                    description={`${element.price} REAIS`}
                    coordinate={{
                    latitude: element.latitude,
                    longitude: element.longitude,
                    latitudeDelta:0,
                    longitudeDelta:0
                    }}
                    />)
            }
        })
        return Markers
    }
    return(
        <View style={styles.container}>
            <MapView
            style={{flex: 1 }}
            region={{
                latitude:Number.parseFloat(navigation.getParam('latitude')),
                longitude: Number.parseFloat(navigation.getParam('longitude')),
                latitudeDelta: 0.2,
                longitudeDelta: 0.1
            }}>
            <Circle
                center={{
                    latitude:Number.parseFloat(navigation.getParam('latitude')),
                    longitude: Number.parseFloat(navigation.getParam('longitude')),
                }}
                radius={5000}
                strokeWidth={1}
                fillColor="rgba(0, 0, 0, 0.2)"
                strokeColor="rgba(0, 0, 0, 0.2)"
                
            />
            <Marker
            pinColor= 'blue'
            title="Você"
            description={'Você está aqui : )'}
            coordinate={{
                latitude:Number.parseFloat(navigation.getParam('latitude')),
                longitude: Number.parseFloat(navigation.getParam('longitude')),
                latitudeDelta: 0.1,
                longitudeDelta: 0.5
            }}
            />
            {handleMarker()}
            </MapView>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex : 1,
    }
})
export default MapsStore