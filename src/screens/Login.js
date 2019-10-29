import React, { useState , useEffect } from 'react'
import { View,
         Text, 
         TextInput, 
         StyleSheet, 
         TouchableOpacity, 
         Image, 
         ActivityIndicator,
         Modal,
         KeyboardAvoidingView
        } 
from 'react-native'
import firebase from 'firebase'
import base64 from 'base-64'
import AsyncStorage from '@react-native-community/async-storage'
import { TextInputMask } from 'react-native-masked-text'
import { Avatar } from 'react-native-elements'
import RNFetchBlob from 'react-native-fetch-blob'
import ImagePicker from 'react-native-image-picker'
import Logo from '../Img/Logo.png'

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob

const Login = ({navigation})=>{
    
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ name, setName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ phoneNumber, setPhoneNumber ] = useState('')
    const [ loading, setLoading ] = useState('')
    const [ modal, setModal ] = useState('')
    const [ sucess, setSucess ] = useState('')
    const [ loginErro, setLoginError ] = useState('')
    const [ registerError, setRegisterErro ] = useState('')
    const [ imageAvatar, setImageAvatar ] = useState('')

    useEffect(()=>{
        setLoading(false)
        setModal(false)
    },[])
    async function handleLogin(){
        setLoading(true)
        try{
            emailLowercase = email.toLowerCase()
            const response = await firebase.auth().signInWithEmailAndPassword(emailLowercase, password)
                .then(()=>{
                    AsyncStorage.setItem('@Email_Key',emailLowercase)
                    setEmail(''), setPassword('')
                })
                .then(()=>{
                    setLoading(false)
                    navigation.navigate('Search')
                })
                .catch((response)=>{
                    setLoading(false)
                    setLoginError(true)
                })
        }catch(err){
            setLoading(false)
        }
    }
    async function handleRegister(){
        setLoading(true)
        try{
            if(!name || !lastName || !phoneNumber || !imageAvatar){
                setRegisterErro('preencha todos os campos')
                setLoading(false)
                setTimeout(() => {
                    setRegisterErro('')
                },3000);
                return
            }
            const mime = 'image/jpeg'
            const email64 = base64.encode(email.toLowerCase())
            const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(()=>{
                    firebase.database().ref(`/Users/${email64}`).set({
                        name, lastName, phoneNumber
                    })})
                    .then(()=>{
                        RNFetchBlob.fs.readFile(imageAvatar, 'base64')
                        .then((data)=>{
                            return RNFetchBlob.polyfill.Blob.build(data, {type:mime+';BASE64'})
                        })
                            .then((blob)=>{
                                const email64 = base64.encode(email.toLowerCase())
                                firebase.storage().ref('Avatar/').child(`/${email64}/`).child('avatar').put(blob, {contentType:mime})
                                .then(()=>{
                                    blob.close()
                                })
                                })})
                                    .then(()=>{
                                        setName('')
                                        setPhoneNumber('')
                                        setLastName('')
                                        setPassword('')
                                        setImageAvatar('')
                                        setLoading(false)
                                        setSucess(true)
                                    })
                                    .catch((response)=>{
                                        setLoading(false)
                                    })
        }catch(err){
            setLoading(false)
        }
    }

    function Buttom(){
        if(loading){
            return(
                <ActivityIndicator style={styles.loading} size='large' color='#7966FF'/>
            )
        }
        return(
                <TouchableOpacity style={styles.btn} onPress={()=> handleLogin()}>
                    <Text style={styles.textBtn}>Entrar</Text>
                </TouchableOpacity>
        )
    }
    function ButtomRegister(){
        if(loading){
            return(
                <ActivityIndicator style={styles.loading} size='large' color='#28EDE7'/>
            )
        }
        return(
            <TouchableOpacity onPress={()=> handleRegister()} style={styles.btn}>
                <Text style={styles.textBtn}>cadastrar</Text>
            </TouchableOpacity>
        )
    }
    function handleRegisterSucess(){
        setTimeout(() => {
            setSucess(false)
            setModal(false)
        }, 2000);
        return(
            <Text style={styles.sucess}>
                seu cadastro foi realizado com sucesso
            </Text>
        )
    }
    function LoginError(){
        setTimeout(()=>{
            setLoginError(false)
        },4000)
        return(
            <Text style={styles.loginErro}>dados incorretos</Text>
        )
    }
    function handleImageProfile(){
        try{
            ImagePicker.launchImageLibrary('',(response)=>{
                if(response.uri){
                    const uri = response.uri.replace('file://','')
                    setImageAvatar(uri)
                }
            })
        }
        catch(err){

        }
    }
    return(
        <KeyboardAvoidingView style={styles.container}style={styles.container}>
            <View>
                <Image style={{width: 150,height:150}} source={Logo}/>
            </View>
            <View style={{flex: 0.1}}>
                { loginErro == true ? LoginError(): <></>}
            </View>
            <TextInput
            value={email}
            style={styles.input}
            placeholder= "  E-mail"
            placeholderTextColor = "#232323"
            textContentType = 'emailAddress'
            onChangeText={(text)=> setEmail(text)}
            />
            <TextInput
            style={styles.input}
            value={password}
            placeholder = "  Senha"
            placeholderTextColor = "#232323"
            secureTextEntry
            textContentType = 'password'
            onChangeText={(text)=> setPassword(text)}
            />
            {Buttom()}
            <Modal visible={modal} animationType='slide'>
                <View style={styles.modal}>
                    <Avatar
                    size='large'
                    rounded
                    source={{uri: imageAvatar}}
                    containerStyle={{marginBottom: 16}}
                    showEditButton={true}
                    onEditPress={()=> handleImageProfile()}
                    editButton={{
                        name:'add',
                        size:30
                    }}
                    />
                    <View style={{flex: 0.3, justifyContent:'center'}}>
                        { sucess == true ? handleRegisterSucess()  : <></> }
                        <Text style={styles.registerError}>{registerError}</Text>
                    </View>
                    <TextInput
                    style={styles.input}
                    placeholder = " Nome"
                    placeholderTextColor = "#232323"
                    onChangeText={(text)=> setName(text)}
                    />
                    <TextInput
                    style={styles.input}
                    placeholder = " Sobrenome"
                    placeholderTextColor = "#232323"
                    onChangeText={(text)=> setLastName(text)}
                    />
                    <TextInput
                    style={styles.input}
                    placeholder = " E-mail"
                    placeholderTextColor = "#232323"
                    onChangeText={(text)=> setEmail(text)}
                    />
                    <TextInputMask
                    value={phoneNumber}
                    type='cel-phone'
                    options={{
                        maskType:'BRL',
                        withDDD: true,
                        dddMask: '(999)  '
                    }}
                    style={styles.input}
                    placeholder = " Telefone"
                    placeholderTextColor = "#232323"
                    onChangeText={(text)=> setPhoneNumber(text)}
                    />
                    <TextInput
                    style={styles.input}
                    placeholder = " Senha"
                    placeholderTextColor = "#232323"
                    onChangeText={(text)=> setPassword(text)}
                    secureTextEntry
                    />
                    {ButtomRegister()}
                    <TouchableOpacity onPress={()=> setModal(false)} style={styles.register_bottom}>
                        <Text style={[styles.register_txt]}>voltar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <View style={styles.register}>
                <TouchableOpacity onPress={()=> setModal(true)}>
                    <Text style={styles.register_txt}>Cadastrar-se</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#1A1A1A',
        justifyContent:'center',
        alignItems:'center'
    },
    input:{
        alignSelf:'stretch',
        marginTop:10,
        marginLeft: 16,
        marginRight: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        color: '#232323',
        height: 41
    },
    btn:{
        borderRadius: 50,
        alignSelf:'stretch',
        marginTop: 23,
        marginLeft: 16,
        marginRight: 16,
        height: 42,
        justifyContent:'center',
        borderRadius: 100,
        backgroundColor: '#7966FF'
    },
    textBtn:{
        color: '#1A1A1A',
        textTransform: 'uppercase',
        fontWeight:'bold',
        textAlign:'center',
        fontSize: 13
    },
    Logo:{
        width: 120,
        height: 120,
        marginBottom: 80
    },
    loading:{
        marginTop: 20,
        marginBottom: 8
    },
    register:{
        flex: 0.7,
        justifyContent:'flex-end'
    },
    register_txt:{
        color: '#7966FF',
        textTransform:  'uppercase',
        fontWeight:'bold',
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 12,
        paddingBottom: 8,
        borderColor: '#7966FF',
        borderWidth: 1.8,
        borderBottomWidth: 5,
        borderRadius: 50,
        fontSize: 13
    },
    register_bottom:{
        marginTop: 24,
    },
    modal:{
        flex: 1,
        backgroundColor: '#1A1A1A',
        justifyContent:'center',
        alignItems:'center'
    },
    sucess:{
        color:'#2ECC71',
        textAlign:'center',
        fontWeight:'bold',
        textTransform:'uppercase',
        marginBottom: 4,
        fontSize: 13
    },
    loginErro:{
        color:'white',
        textAlign:'center',
        fontWeight:'bold',
        textTransform:'uppercase',
        marginBottom: 4,
        fontSize: 13
    },
    registerError:{
        textAlign:'center',
        fontWeight:'bold',
        color:'red',
        textTransform:'uppercase',
        marginBottom: 10,
        fontSize: 13
    }
})
export default Login