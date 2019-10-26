import React from 'react'
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'
import Pin from '../Img/pin.png'


const ProfileUser = ({navigation})=>{
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Avatar
                size='large'
                rounded
                source={{uri: navigation.getParam('avatar')}}
                />
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.txt}>{navigation.getParam('name')} </Text>
                    <Text style={styles.txt}>{navigation.getParam('lastName')}</Text>
                </View>
                <Text style={styles.phone}>{navigation.getParam('phone')}</Text>
            </View>
            {console.log(JSON.parse(navigation.getParam('posts')))}
            <View style={{flex:7.4}}>
                <Text style={styles.enun}>anuncios</Text>
                <FlatList
                data={JSON.parse(navigation.getParam('posts'))[0]}
                keyExtractor={(index, item)=> item.toString()}
                renderItem={({item})=>{
                   if(item.stateOfHouse == true){
                    return(
                        <TouchableOpacity onPress={()=> navigation.navigate('Photos',{
                            storage: item.storage,
                            userId: navigation.getParam('userId')
                            })}>
                            <View style={styles.ar}>
                                <View style={{width:'50%', flexDirection:'row', justifyContent:'flex-start',alignItems:'center'}}>
                                    <Icon
                                    color='#1A1A1A'
                                    name='home'
                                    size={30}
                                    />
                                <Text style={{marginLeft: 4, fontWeight:'500',fontSize:12}}>{item.home}</Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'flex-end',width:'50%',alignItems:"center"}}>
                                    <TouchableOpacity onPress={()=> navigation.navigate('Router', {
                                        latitude :item.latitude,
                                        longitude: item.longitude,
                                        latitudeUser: navigation.getParam('latitudeUser'),
                                        longitudeUser: navigation.getParam('longitudeUser')
                                    })}>
                                        <Image style={{height: 30, width: 30, marginRight: 6}} source={Pin}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                   }
                   if(item.stateOfHouse == false){
                    return(
                        <TouchableOpacity onPress={()=> navigation.navigate('Photos',{
                            storage: item.storage,
                            userId: navigation.getParam('userId')
                            })}>
                            <View style={styles.notAr}>
                                <View style={{flexDirection: 'row', width:'50%', justifyContent:'flex-start',alignItems:'center'}}>
                                    <Icon
                                    name='home'
                                    size={30}
                                    />
                                    <Text style={{marginLeft: 4, fontWeight:'500', fontSize:12}}>{item.home}</Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'flex-end',width: '50%',alignItems:'center'}}>
                                    <Text style={{marginLeft: 30, marginRight: 30, fontSize:12}}>Não está disponivél</Text>
                                    <TouchableOpacity onPress={()=> navigation.navigate('Router',{
                                        latitude :item.latitude,
                                        longitude: item.longitude,
                                        latitudeUser: navigation.getParam('latitudeUser'),
                                        longitudeUser: navigation.getParam('longitudeUser'),
                                    })}>
                                        <Image style={{height: 30, width: 30, marginRight: 6}} source={Pin}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                    
                   }
                }}
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#D4D8E8'
    },
    header:{
        flex:2.6, 
        flexDirection:'column', 
        alignItems:'center', 
        backgroundColor:'#9B8CFF',
        justifyContent:'center'
    },
    txt:{
        fontWeight:'600',
        color:'#1A1A1A', 
        marginTop: 6,
        fontSize: 12,
        textTransform:'uppercase'
    },
    phone:{
        fontWeight: '600',
        color:'#1A1A1A',
        fontSize: 12
    },
    ar:{
        marginBottom: 2,
        height: 55,
        backgroundColor:'#B0FFBA',
        flexDirection:'row' ,

    },
    notAr:{
        marginBottom: 2,
        height: 55,
        backgroundColor:'#FF4C4C',
        flexDirection:'row' ,
    },
    enun:{
        margin: 10,
        textAlign:"center",
        color:'#385898',
        textTransform:'uppercase',
        fontWeight:'bold'
    }
})
export default ProfileUser