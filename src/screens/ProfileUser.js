import React from 'react'
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'


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
            <View style={{flex:7.6}}>
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
                                <Icon
                                color='#1A1A1A'
                                name='home'
                                size={30}
                                />
                                <Text style={{marginLeft: 4, fontWeight:'bold'}}>{item.home}</Text>
                                <View style={{flexDirection:'row',justifyContent:'flex-end',width:'80%'}}>
                                    <TouchableOpacity onPress={()=> navigation.navigate('Router', {
                                        latitude :item.latitude,
                                        longitude: item.longitude,
                                        latitudeUser: navigation.getParam('latitudeUser'),
                                        longitudeUser: navigation.getParam('longitudeUser')
                                    })}>
                                        <Icon
                                        color='#1A1A1A'
                                        name='near-me'
                                        />
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
                                <Icon
                                name='home'
                                size={30}
                                />
                                <Text style={{marginLeft: 4, fontWeight:'bold'}}>{item.home}</Text>
                                <View style={{flexDirection:'row',justifyContent:'space-between',width: '65%'}}>
                                    <Text style={{marginLeft: 30}}>Não está disponivél</Text>
                                    <TouchableOpacity onPress={()=> navigation.navigate('Router',{
                                        latitude :item.latitude,
                                        longitude: item.longitude,
                                        latitudeUser: navigation.getParam('latitudeUser'),
                                        longitudeUser: navigation.getParam('longitudeUser'),
                                    })}>
                                        <Icon
                                        name='near-me'
                                        />
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
        flex:2.4, 
        flexDirection:'column', 
        alignItems:'center', 
        backgroundColor:'#8B9DC3',
        justifyContent:'center'
    },
    txt:{
        fontWeight:'bold',
        color:'#1A1A1A', 
        marginTop: 6,
        fontSize: 16
    },
    phone:{
        fontWeight:'bold',
        color:'#1A1A1A',
        fontSize: 16
    },
    ar:{
        marginBottom: 2,
        height: 55,
        backgroundColor:'#6CFF7E',
        flexDirection:'row' ,
        alignItems:'center'
    },
    notAr:{
        marginBottom: 2,
        height: 55,
        backgroundColor:'#FF4C4C',
        flexDirection:'row' ,
        alignItems:'center'
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