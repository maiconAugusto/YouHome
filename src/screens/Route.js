import React from 'react'
import { View, StyleSheet } from 'react-native'
import  MapView  from 'react-native-maps'
import { Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions';
import key from '../config/key'


const Route = ({navigation})=>{

    return(
        <View style={styles.container}>
            <MapView
            style={{flex: 1}}
            region={{
                latitude: Number.parseFloat(navigation.getParam('latitudeUser')),
                longitude: Number.parseFloat(navigation.getParam('longitudeUser')),
                latitudeDelta:0,
                longitudeDelta:0.1
            }}
            >
            <Marker
            pinColor='blue'
            title='Você está aqui'
            coordinate={{
                latitude: Number.parseFloat(navigation.getParam('latitudeUser')),
                longitude: Number.parseFloat(navigation.getParam('longitudeUser')),
            }}
            />
            <Marker
            pinColor='green'
            title={navigation.getParam('home')}
            coordinate={{
                latitude: Number.parseFloat(navigation.getParam('latitude')),
                longitude: Number.parseFloat(navigation.getParam('longitude')),
            }} 
            /> 
            <MapViewDirections
            origin={{
                latitude: Number.parseFloat(navigation.getParam('latitudeUser')),
                longitude: Number.parseFloat(navigation.getParam('longitudeUser')),
            }}
            destination={{
                latitude: Number.parseFloat(navigation.getParam('latitude')),
                longitude: Number.parseFloat(navigation.getParam('longitude')),
            }}
            apikey={key}
            strokeWidth={3}
            strokeColor="red"
            >
            </MapViewDirections> 
            </MapView>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1
    }
})
export default Route
/**
 * 
 * <MapView
            style={{flex: 1}}
            coordinate={{
                latitude: latitudeUser,
                longitude: longitudeUser,
                latitudeDelta: 0.1,
                longitudeDelta:0.5
            }}>
            <Marker
            title="Você"
            pinColor='green'
            coordinate={{
                latitude: latitudeUser,
                longitude: longitudeUser,
                latitudeDelta: 0.1,
                longitudeDelta:0.5  }}/>
            <Marker
            pinColor='red'
            coordinate={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.1,
                longitudeDelta:0.5 
            }}/>
            </MapView>
 */