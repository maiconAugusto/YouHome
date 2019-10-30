import React, { useState,useEffect} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Switch } from 'react-native'
import House from '../Img/houses.png'
import firebase from 'firebase'
import dateNow from '../config/date'

const EditPost = ({navigation})=>{
    const [ value , setValue ] = useState('')
    const [ sucess, setSucess ] = useState('')
    const [ infoPost, setInfoPost ] = useState('')
    const [ loading, setLoading ] = useState('')
    useEffect(()=>{
        setLoading(false)
        setValue(navigation.getParam('state'))
        setInfoPost(JSON.parse(navigation.getParam('item')))
        setSucess(false)
    },[])

    async function handleEdit(){
        try{
            if(value == true || value == false){
                setLoading(true)
                const response = await firebase.database().ref('/Post').child(`/${navigation.getParam('userId')}/${navigation.getParam('key')}/`).update({
                    date: dateNow,
                    home: infoPost.home,
                    latitude: infoPost.latitude,
                    longitude: infoPost.longitude,
                    price: infoPost.price,
                    space: infoPost.space,
                    stateOfHouse: value,
                    storage: infoPost.storage,
                    userId: infoPost.userId
                })
                .then(()=>{
                    firebase.database().ref('/Posts/').child(`/${navigation.getParam('key')}/`).update({
                        date: dateNow,
                        home: infoPost.home,
                        latitude: infoPost.latitude,
                        longitude: infoPost.longitude,
                        price: infoPost.price,
                        space: infoPost.space,
                        stateOfHouse: value,
                        storage: infoPost.storage,
                        userId: infoPost.userId
                    })
                })
                .then(()=>{
                    setLoading(false)
                    setSucess(true)
                })
            } 
            else{
                return
            }               
        }
        catch(err){
            setSucess(false)
        }
    }
    function handleCondition(){
        if(value === false){
            return(
                <Text style={[styles.txtValue,{color:'red'}]}>imovél indisponível</Text>
            )
        }
        else if(value === true){
            return(
                <Text style={styles.txtValue}>imovél disponível</Text>
            )
        }
    }
    function handleSucess(){
        setTimeout(()=>{
            setSucess(false)
        },3000)
        return(
            <Text style={styles.txtSucess}>salvo com sucesso</Text>
        )
    }
    function Buttom(){
        if(loading == true){
            return(
                <TouchableOpacity style={styles.btn_save} disabled={true} onPress={()=>handleEdit()}>
                    <ActivityIndicator size='large' color='white'/>
                </TouchableOpacity>
            )
        }
        return(
            <TouchableOpacity style={styles.btn_save} onPress={()=>handleEdit()}>
                <Text style={[styles.textBtn,{color:'white'}]}>salvar</Text>
            </TouchableOpacity>
        )
    }
    return(
        <View style={styles.container}>
            <View style={{alignItems:'center', flex: 2}}>
                <Image style={{width: 85, height: 85, marginTop: 30}} source={House}/>
            </View>
            <View style={{flex: 8}}>
            <View style={{flex: 2, justifyContent:'center',alignItems:'center'}}>
                <View style={{flex: 0.5, justifyContent:'center'}}>
                    { sucess == true ? handleSucess(): null }
                </View>
                <View style={{flex: 0.5}}>
                    {handleCondition()}
                </View>
            </View>
            <View style={{flex: 1, justifyContent:'center', marginBottom: 6}}>
                <Text style={styles.txt}>altere a disponíbilidade do imovél</Text>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Switch style={styles.switch} value={value} onValueChange={(values)=> setValue(values)}/>
                </View>
                {Buttom()}
            </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column', 
        backgroundColor:'#D4D8E8'
    },
    btn_save:{
        borderRadius: 50,
        alignSelf:'stretch',
        marginLeft: 16,
        marginTop: 20,
        marginBottom: 8,
        marginRight: 16,
        height: 46,
        justifyContent:'center',
        borderRadius: 4,
        backgroundColor: '#7966FF'
    },
    textBtn:{
        color: '#1A1A1A',
        textTransform: 'uppercase',
        fontWeight:'bold',
        textAlign:'center',
        fontSize: 12,
    },
    txt:{
        fontSize: 12,
        textTransform:'uppercase',
        fontWeight:'bold',
        textAlign:'center'
    },
    txtValue:{
        color:'#27AE60',
        fontSize: 12,
        textTransform:'uppercase',
        fontWeight:'bold',
        textAlign:'center',
        marginTop: 8
    },
    txtSucess:{
        paddingTop: 10,
        paddingLeft: 28,
        paddingRight: 28,
        paddingBottom: 10,
        borderRadius: 30,
        backgroundColor:'white',
        color:'#27AE60',
        fontSize: 12,
        textTransform:'uppercase',
        fontWeight:'bold',
        textAlign:'center',
    },
    switch:{
        marginBottom: 20, 
        marginTop: 20
    }
})
export default EditPost