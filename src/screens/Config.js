import React, { useState, useEffect } from  'react'
import {View, 
        TextInput, 
        StyleSheet, 
        TouchableOpacity, 
        ActivityIndicator, 
        Text,
        AsyncStorage } 
from 'react-native'
import firebase from 'firebase'
import base64 from 'base-64'
import { TextInputMask } from 'react-native-masked-text'
import { Avatar } from 'react-native-elements'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'react-native-fetch-blob'

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob

const Config = ({navigation})=>{

    const [ loading, setLoading ] = useState('')
    const [ name, setName ] = useState('')
    const [ lastName, setlastName] = useState('')
    const [ phoneNumber, setPhoneNumber ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ UpdateSucess, setUpadeSucess ] = useState('')
    const [ UpdateError , setUpadeError ] = useState('')
    const [ avatar, setAvatar ] = useState()

    useEffect(()=>{
        AsyncStorage.getItem('@Email_Key')
            .then((response)=>{
                setEmail(base64.encode(response))
            })
    },[])

    async function handleModifyUser(){
        try{
            if(!name || ! lastName || !phoneNumber ){
                setUpadeError('Todos os campos devem ser preenchidos')
                setTimeout(() => {
                    setUpadeError('')
                }, 4000);
                return
            }
            setLoading(true)
            const mime= 'image/jpeg'
            const response = await firebase.database().ref(`/Users/${email}`).update({ name, lastName, phoneNumber })
                .then(()=>{
                    RNFetchBlob.fs.readFile(avatar,'base64')
                        .then((data)=>{
                            return RNFetchBlob.polyfill.Blob.build(data,{type:mime+';BASE64'})
                        })
                            .then((blob)=>{
                                firebase.storage().ref('Avatar/').child(`/${email}/`).child('avatar').put(blob, {contentType:mime})
                                    .then(()=>{
                                        blob.close()
                                    })
                                })
                })
                    .then(()=>{
                        setLoading(false), setUpadeSucess(true), 
                        setlastName(null), setName(''), setPhoneNumber(''), setAvatar('')
                    })
                        .catch(()=>{
                            setLoading(false)
                        })
        }catch(err){
            setLoading(false)
        }
    }
    function Buttom(){
        if(loading){
            return(
                <TouchableOpacity style={styles.btn} disabled={true}>
                    <ActivityIndicator size='large' color='#1A1A1A'/>
                </TouchableOpacity>
            )
        }
        return(
                <TouchableOpacity style={styles.btn} onPress={()=> handleModifyUser()}>
                    <Text style={styles.textBtn}>alterar dados</Text>
                </TouchableOpacity>
        )
    }
    function UpdateData(){
        setTimeout(()=>{
            setUpadeSucess(false)
        },3000)
        return(
            <Text style={styles.sucess}>dados atualizados com sucesso</Text>
        )
    }
    function handleCancelData(){
        setEmail(''), setEmail(''), setPhoneNumber(''), setAvatar('')
        navigation.goBack()
    }
    function handleAvatar(){
        ImagePicker.launchImageLibrary('',(response)=>{
            if(response.uri){
                const uri = response.uri.replace('file://','')
                setAvatar(uri)
            }
        })
    }
    return(
        <View style={styles.container}>
            <View style={{ flex: 5, alignSelf:'stretch', justifyContent:'center'}}>
                <View style={{ alignItems:'center',marginBottom: 10}}>
                    <Avatar
                    rounded
                    size='large'
                    source={{uri: avatar}}
                    showEditButton={true}
                    onEditPress={()=> handleAvatar()}
                    editButton={{
                        name:'add',
                    }}
                    />
                </View>
                <View style={{ alignSelf:'stretch', justifyContent:'flex-end'}}>
                    {  UpdateSucess === true ? 
                       UpdateData() : 
                       <></>
                    }
                </View>
                <Text style={styles.error}>{UpdateError}</Text>
                <TextInput
                value={name}
                style={styles.input}
                placeholder = " Nome"
                placeholderTextColor = "#232323"
                onChangeText={(text)=> setName(text)}
                />
                <TextInput
                value={lastName}
                style={styles.input}
                placeholder = " Sobrenome"
                placeholderTextColor = "#232323"
                onChangeText={(text)=> setlastName(text)}
                />
                <TextInputMask
                value={phoneNumber}
                type='cel-phone'
                options={{
                    maskType:'BRL',
                    withDDD: true,
                    dddMask:'(999)  '
                }}
                style={styles.input}
                placeholder = " Telefone"
                placeholderTextColor = "#232323"
                onChangeText={(text)=> setPhoneNumber(text)}
                />
                {Buttom()}
                <TouchableOpacity style={styles.btn_cancel} onPress={()=> handleCancelData()}>
                    <Text style={[styles.textBtn,{color:'white'}]}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex : 1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:'#1A1A1A'
    },
    input:{
        height: 41,
        alignSelf:'stretch',
        marginTop: 10,
        marginLeft: 16,
        marginRight: 16,
        backgroundColor: 'white',
        borderRadius: 4,
        color: '#232323',
    },
    btn:{
        borderRadius: 50,
        alignSelf:'stretch',
        marginTop: 40,
        marginLeft: 16,
        marginRight: 16,
        height: 41,
        justifyContent:'center',
        borderRadius: 4,
        backgroundColor: '#7966FF'
    },
    textBtn:{
        color: '#1A1A1A',
        textTransform: 'uppercase',
        fontWeight:'bold',
        textAlign:'center'
    },
    sucess:{
        color:'#2ECC71',
        textAlign:'center',
        fontWeight:'bold',
        textTransform:'uppercase',
        marginBottom: 4
    },
    btn_cancel:{
        borderRadius: 50,
        alignSelf:'stretch',
        marginLeft: 16,
        marginBottom: 8,
        marginRight: 16,
        marginTop: 10,
        height: 42,
        justifyContent:'center',
        borderRadius: 4,
        backgroundColor: '#E70000'
    },
    textBtn:{
        color: '#1A1A1A',
        textTransform: 'uppercase',
        fontWeight:'bold',
        textAlign:'center'
    },
    error:{
        marginBottom: 8,
        color: 'red',
        textTransform:'uppercase',
        textAlign:'center',
        fontWeight:'bold'
    }
})
export default Config