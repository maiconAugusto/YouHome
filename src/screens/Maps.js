import React from 'react'
import { Marker } from 'react-native-maps'
import  MapView  from 'react-native-maps'
import {View, 
        StyleSheet, 
        TouchableOpacity, 
        Text, ActivityIndicator, 
        Modal, Picker, 
        AsyncStorage,
        Image,
        ScrollView,
    } 
from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import firebase from 'firebase'
import ImagePicker from 'react-native-image-picker'
import DateNow from '../config/date'
import base64 from 'base-64'
import { TextInputMask } from 'react-native-masked-text'
import { Icon } from 'react-native-elements'

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob
const Fetch = RNFetchBlob.polyfill.Fetch
window.fetch = new Fetch({
    auto: true,
    binaryContentTypes:[
        'image/','video/', 'audio/','foo/'
    ]
}).build()

export default class Maps extends React.Component{
    constructor(props){
        super(props)
            this.state = {
                latitude: null,
                longitude: null,
                loading: '',
                modal: null,
                emailUser: '',
                home: '',
                price:'',
                space: '',
                postSucess: false,
                images: [],
                modalPicker: false,
                valueImages: 0,
                imagePage: [],
                postError: ''
            }
            AsyncStorage.getItem('@Email_Key')
                .then((response)=>{
                    const emailB64 = base64.encode(response)
                    this.setState({emailUser: emailB64})
            })
    }
    handleMarker(event){
        this.setState({ latitude: parseFloat(event.latitude), longitude: parseFloat(event.longitude)})
    }
    Buttom(){
        if(this.state.loading){
            return(
                <TouchableOpacity style={styles.btn} disabled={true}>
                    <ActivityIndicator style={styles.loading} size='large' color='#1A1A1A'/>
                </TouchableOpacity>
            )
        }
            return(
                <TouchableOpacity style={styles.btn} onPress={()=> this.handlePost()}>
                    <Text style={styles.textBtn}>Salvar</Text>
                </TouchableOpacity>
            )
    }
    async handlePost(){  
        try{
            if(! this.state.latitude || !this.state.longitude || !this.state.price || !this.state.images ){
                this.setState({postError: 'insira todos os dados'})
                setTimeout(()=>{
                    this.setState({postError:''})
                },3000)
                return
            } 
            this.setState({ loading: true})
            const post = await firebase.database().ref('/Post/')
            const keyStorage = post.push().key
            const response =  post.child(`/${this.state.emailUser}/${keyStorage}`)
            response.set({ latitude: this.state.latitude, 
                            longitude: this.state.longitude, 
                            price: this.state.price, 
                            home: this.state.home, 
                            space: this.state.space, 
                            userId: this.state.emailUser,
                            date: DateNow, 
                            stateOfHouse: true,
                            storage: keyStorage })
                    .then(()=>{
                        const response = firebase.database().ref(`/Posts/`)
                        response.child(`${keyStorage}`).set({ latitude: this.state.latitude, 
                            longitude: this.state.longitude, 
                            price: this.state.price, 
                            home: this.state.home, 
                            space: this.state.space, 
                            userId: this.state.emailUser,
                            date: DateNow, 
                            stateOfHouse: true,
                            storage: keyStorage })
                    })
                    .then(()=>{
                        this.setState({ latitude:0, longitude: 0, price:0, home:0 , space:0,
                                        loading:0, postSucess:true  , images: null
                        })
                    })
            const mime = 'image/jpeg'
                for(let i =0; i<this.state.images.length; i++){
                    RNFetchBlob.fs.readFile(this.state.images[i],'base64')
                        .then((data)=>{
                            return RNFetchBlob.polyfill.Blob.build(data, {type:mime+';BASE64'})
                                })
                                .then((blob)=>{
                                    firebase.storage().ref('/Users/').child(`/${this.state.emailUser}/`).child(`${keyStorage}`).child(`${i}`).put(blob, {contentType:mime})
                                        .then(()=>{
                                            blob.close()
                                                this.setState({loading: false})
                                        })
                                })
                }
        }
        catch(err){
            this.setState({loading: false})
            console.log(err)
        }
    }
    handleCancel(){
        this.setState({ space: 0, latitude:0, latitude:0 , price: '', home:0, space: 0})
    }
    handlePostSucess(){
        setTimeout(()=>{
            this.setState({postSucess: false})
        },3000)
        return(
            <Text style={styles.postSucess}>anuncio criado com sucesso</Text>
        )
    }
    PickerType(){
        return(
            <View style={styles.border}>
                <Picker 
                mode='dialog'
                style={styles.select}
                selectedValue={this.state.home} 
                onValueChange={(itemValue, itemIndex)=> this.setState({home: itemValue})}>
                    <Picker.Item color="#1A1A1A" key={0} value={0} label="TIPO DO IMÓVEL"/>
                    <Picker.Item color="#1A1A1A" key={0} value={"APARTAMENTO"} label="APARTAMENTO"/>
                    <Picker.Item color="#1A1A1A" key={0} value={"CASA"} label="CASA"/>
                    <Picker.Item color="#1A1A1A" key={0} value={"KITNET"} label="KITNET"/>
                </Picker>
            </View>
        )
    }
    PickerQuantity(){
        return(
            <View style={styles.border}>
                <Picker 
                mode='dropdown'
                style={[styles.select, styles.select_second]}
                selectedValue={this.state.space} 
                onValueChange={(itemValue, itemIndex)=> this.setState({space: itemValue})}>
                    <Picker.Item color="#1A1A1A" key={0} value={0} label="CÔMODOS"/>
                    <Picker.Item color="#1A1A1A" key={0} value={"1"} label="1"/>
                    <Picker.Item color="#1A1A1A" key={0} value={"2"} label="2"/>
                    <Picker.Item color="#1A1A1A" key={0} value={"3"} label="3"/>
                    <Picker.Item color="#1A1A1A" key={0} value={"4"} label="4"/>
                    <Picker.Item color="#1A1A1A" key={0} value={"5"} label="5"/>
                    <Picker.Item color="#1A1A1A" key={0} value={"6"} label="6"/>
                    <Picker.Item color="#1A1A1A" key={0} value={"7"} label="7"/>
            </Picker>
            </View>
        )
    }
    PickerPrice(){
        return(
            <View style={styles.border}>
                <TextInputMask
                style={{ width: 145, height: 40}}
                type='money'
                options={{
                    precision: '2',
                    separator:',',
                    delimiter: '.',
                    unit: 'R$ ',
                    suffixUnit: ''
                }}
                placeholder = "  VALOR"
                placeholderTextColor = 'black'
                value={this.state.price}
                onChangeText={(text)=> this.setState({price: text})}
                />
            </View>
        )
    }
    handleAddImage(){
        ImagePicker.launchImageLibrary('',(response)=>{
            if(response.uri){
                let uri =  response.uri.replace('file://','') 
                let imageData = { uri: response.uri }
                this.setState({images: [...this.state.images, uri ],
                valueImages: this.state.valueImages + 1,
                imagePage: [...this.state.imagePage, imageData ]
                })
            }
        })
    }
    handleCancelLocation(){
        this.setState({ images: [], valueImages: 0, modalPicker: false})
    }
    handleRemoveImage(index){
        const { imagePage } = this.state
        imagePage.pop(index)
        this.setState({ imageData: [...this.state.imagePage,imagePage], valueImages: this.state.valueImages - 1})
    }
    handleImages(){
        const render = this.state.imagePage.map((element,index)=>{
            return(
                <View key={element}>
                    <Image style={{width:140, height: 140,marginTop:8}} source={element}/>
                    <TouchableOpacity onPress={()=> this.handleRemoveImage(index) }>
                        <Text style={styles.removePhoto}>Remover</Text>
                    </TouchableOpacity>
                </View>
            )
        })
        return render
    }
    handleModalPicker(){
        return(
            <Modal animationType='slide' visible={this.state.modalPicker}>
                <View style={{flex: 1, flexDirection:"column", backgroundColor:'#1A1A1A'}}>
                    <ScrollView style={{flex: 2, flexDirection: 'column'}}>
                        <View style={styles.containerImages}>
                            {this.handleImages()}
                        </View>
                    </ScrollView>
                    <View style={{flex: 0.4,alignItems:'center',justifyContent:"flex-end"}}>
                        <Text style={styles.valueImages}>{this.state.valueImages} imagem</Text>
                        <TouchableOpacity onPress={()=> this.handleAddImage()}>
                            <Icon
                            size={45}
                            color='#35FF62'
                            name='photo-library'
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:0.6,alignItems:'flex-end'}}>
                        <TouchableOpacity style={styles.btn} onPress={()=> this.setState({modalPicker: false})} >
                            <Text style={styles.textBtn}>Salvar imagens</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn_cancel} onPress={()=> this.handleCancelLocation()}>
                            <Text style={[styles.textBtn,{color:'white'}]}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
    componentWillMount(){
        this.setState({ latitude:0 ,longitude: 0})
    }
    render(){
        console.log(this.state.images)
        return(
            <View style={styles.container}>
                <TouchableOpacity style={{flex: 0.5}} onPress={()=> this.setState({modal: true})}>
                    <MapView
                    style={{flex: 1 }}
                    initialRegion={{
                    latitude: Number.parseFloat(this.props.navigation.getParam('latitude')),
                    longitude: Number.parseFloat(this.props.navigation.getParam('longitude')),
                    latitudeDelta: 0.35,
                    longitudeDelta: 0.45
                    }}
                    />
                </TouchableOpacity>
                <View>
                    <Modal animationType='slide' visible={this.state.modal}>
                        <View style={{flex: 0.6, backgroundColor:'#1A1A1A', alignItems:'center', justifyContent:"center"}}>
                            <Text style={styles.info}>" localize seu imóvel no mapa, de um click e salve "</Text>
                        </View>
                        <View style={{flex: 5}}>
                            <MapView
                            mapType= 'standard'
                            onPress={(event)=> this.handleMarker(event.nativeEvent.coordinate)}
                            style={{flex: 1 }}
                            initialRegion={{
                            latitude: Number.parseFloat(this.props.navigation.getParam('latitude')),
                            longitude: Number.parseFloat(this.props.navigation.getParam('longitude')),
                            latitudeDelta: 0.10,
                            longitudeDelta: 0.10
                            }}
                            >
                            <Marker pinColor="green"
                            title="CASA DISPONÍVEL"
                            coordinate={{
                            latitude: Number.parseFloat(this.state.latitude),
                            longitude: Number.parseFloat(this.state.longitude),
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.1
                            }}/>
                            </MapView>
                        </View>
                        <View style={{flex: 2, backgroundColor:'#1A1A1A'}}>
                            <TouchableOpacity style={styles.btn} onPress={()=> this.setState({modal: false})}>
                                <Text style={styles.textBtn}>Salvar Localização</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn_cancel]} onPress={()=> this.setState({modal: false})}>
                                <Text style={[styles.textBtn,{color:'white'}]}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
                <View style={styles.photo}>
                    <View style={{flex: 1, marginRight: 4, marginLeft: 4, marginTop: 12}}>
                        {this.PickerType()}
                        <View style={{flexDirection:'row', justifyContent:'space-between',marginTop: 4}}>
                            <View style={{width:'50%'}}>
                                {this.PickerQuantity()}
                            </View>
                            <View style={{width:'50%'}}>
                                {this.PickerPrice()}
                            </View>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'center'}}>
                            <TouchableOpacity style={styles.picker} onPress={()=> this.setState({modalPicker: true})}>
                                <Icon
                                size={45}
                                color='white'
                                name='add-a-photo'
                                />
                            </TouchableOpacity>
                            {this.handleModalPicker()}
                        </View>
                    </View>
                    <View style={styles.container_register}>
                        <Text style={styles.postError}>{this.state.postError}</Text>
                        {this.state.postSucess === true ? this.handlePostSucess() : <></>}
                        {this.Buttom()}
                        <TouchableOpacity style={styles.btn_cancel} onPress={()=> this.handleCancel()}>
                            <Text style={[styles.textBtn,{color:'white'}]}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex : 1,
    },
    photo:{
        flex: 1,
        backgroundColor:'#1A1A1A'
    },
    btn:{
        borderRadius: 50,
        alignSelf:'stretch',
        marginTop: 36,
        marginLeft: 16,
        marginBottom: 12,
        marginRight: 16,
        height: 41,
        justifyContent:'center',
        borderRadius: 4,
        backgroundColor: '#7966FF'
    },
    btn_cancel:{
        borderRadius: 50,
        alignSelf:'stretch',
        marginLeft: 16,
        marginBottom: 8,
        marginRight: 16,
        height: 41,
        justifyContent:'center',
        borderRadius: 4,
        backgroundColor: '#E70000'
    },
    container_register:{
        flex: 0.2,
        justifyContent: 'flex-end',
        marginBottom: 20
    },
    textBtn:{
        color: '#1A1A1A',
        textTransform: 'uppercase',
        fontWeight:'bold',
        textAlign:'center'
    },
    info:{
        textTransform:'uppercase',
        fontSize: 14,
        color: 'white',
        textAlign:"center",
        marginLeft: 25,
        marginRight: 25,
        fontWeight:'bold'
    },
    select:{
        marginTop: 4,
        marginBottom: 4,
        height: 29,
        color: 'black',
    },
    select_second:{
        width: 145,
    },
    postSucess:{
        color:'#2ECC71',
        textAlign:'center',
        fontWeight:'bold',
        textTransform:'uppercase',
        marginBottom: 4
    },
    border:{
        marginBottom: 4,

        marginLeft: 8, 
        marginRight: 8,
        borderWidth:2,
        borderColor:'#1A1A1A',
        borderRadius: 8,
        backgroundColor:'white'
    },
    picker:{
        marginTop: 18
    },
    add_images:{
        color: '#28EDE7',
        textTransform:  'uppercase',
        fontWeight:'bold',
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 12,
        paddingBottom: 12,
        borderColor: '#28EDE7',
        borderWidth: 1.8,
        borderColor: '#28EDE7',
        borderRadius: 50
    },
    valueImages:{
        marginBottom: 40,
        fontWeight:'bold',
        color:'white',
        fontSize: 14,
        textTransform:'uppercase'
    },
    containerImages:{
        flexDirection:'row',
        flexWrap:'wrap',
        alignItems:'flex-start', 
        justifyContent:'space-evenly',
        marginTop: 12,
    },
    postError:{
        color:'#E70000',
        textAlign:'center',
        fontWeight:'bold',
        textTransform:'uppercase',
        marginBottom: 4
    },
    removePhoto:{
        color:'#E70000',
        textAlign:'center',
        fontWeight:'bold',
        textTransform:'uppercase',
        marginTop: 4
    }
})