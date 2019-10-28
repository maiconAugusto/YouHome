import React, { useState, useEffect} from 'react'
import { View, Text , FlatList, StyleSheet, AsyncStorage, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Icon, Divider } from 'react-native-elements'
import firebase from 'firebase'

const MyHomes = ({navigation})=>{

    const [ emailUser, setEmailUser ] = useState('')
    const [ posts, setPosts ] = useState([])
    const [ loading, setLoading ] = useState('')


    useEffect(()=>{
        setLoading(true)
    },[])
    useEffect(()=>{
        setEmailUser(navigation.getParam('emailUser'))
        handlePost()
    },[])

    async function handlePost() {
        const response =  firebase.database().ref('/Post/').child(`/${navigation.getParam('emailUser')}/`)
        .on('value',snapshot=>{
            if(snapshot.val() !== null){
                setLoading(false)
                return setPosts(Object.values(snapshot.val()))
            }
            setLoading(false)
            })
    }

    async function handleRemoveHome(item,index){
        try{
            const postRemove = posts
            postRemove.pop(index)
            setPosts(postRemove)
            const remove =  firebase.storage().ref('/Users/').child(`/${emailUser}/${item}/`)
            const response = await firebase.storage().ref('/Users/').child(`/${emailUser}/${item}/`).list()
                .then((url)=>{
                    const data = url.items.map((element)=>{
                        element.getDownloadURL().then((data)=>{
                           
                        })
                    }) 
                for(let i = 0; i < data.length; i++){
                    remove.child(`${i}`).delete()
                }
                })
                const removeBD = await firebase.database().ref().child(`/Post/${emailUser}/${item}`).set(null)
                    .then(()=>{
                    firebase.database().ref().child(`/Posts/${item}`).set(null)
                })             
        }
        catch(err){

        }
    }

    function handleListPosts(item, index){
        return(
                <TouchableOpacity onPress={()=> navigation.navigate('EditPost',{
                    userId: item.userId, 
                    key: item.storage, state: 
                    item.stateOfHouse,
                    item: JSON.stringify(item)
                    })}>
                    <View style={{flexDirection:'row', marginTop: 4, marginBottom: 4}}>
                        <View style={styles.post}>
                            <Text style={[styles.info]}>Tipo de imovél: {item.home}</Text>
                            <Text style={styles.info}>Preço: {item.price}</Text>
                            <Text style={styles.info}>Comôdos: {item.space}</Text>
                            <Text style={styles.info}>publicado em: {item.date}</Text>
                        </View>
                        <View style={styles.resolve}>
                            <TouchableOpacity onPress={()=> handleRemoveHome(item.storage,index)}>
                                <Icon
                                containerStyle={{marginRight: 8}}
                                size={35}
                                color = 'red'
                                name='delete'
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
        )
    }
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.anuncio}>meus anuncios</Text>
            </View>
            <Divider style={{margin: 20}}/>
            <View style={{flex:6}}>
                { loading ===  true ? 
                  <View style={{ justifyContent:'center',marginTop:50}}>
                    <ActivityIndicator  size='large' color='#7966FF'  />
                  </View>
                 : 
                 <></>
                 }
                <FlatList
                data={posts}
                renderItem={({item,index})=> handleListPosts(item,index)}
                keyExtractor={(item,index)=> index.toString()}
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection:'column',
        backgroundColor: '#1A1A1A'
    },
    post:{
        height: 100,
        width: '60%',
        backgroundColor:'white',
        justifyContent:'center',
    },
    resolve:{
        height: 100,
        width: '40%',
        justifyContent:'center',
        alignItems:'flex-end',
        backgroundColor:'white',
    },
    info:{
        fontSize: 13,
        textAlign:'left',
        marginLeft: 8,
        textTransform:'uppercase',
        fontWeight:'800'
    },
    header:{
        flex: 1,
        justifyContent:"center",
        alignItems:'center'
    },
    Logo:{
        width: 70,
        height: 70,
        marginTop:8
    },
    notpost:{
        textAlign:'center',
        textTransform:'uppercase',
        fontWeight:'bold',
        color:'red'
    },
    anuncio:{
        fontSize: 13,
        textTransform:'uppercase',
        textAlign:'center',
        fontWeight: 'bold',
        color:'#FFFFFF'
    }
})
export default MyHomes