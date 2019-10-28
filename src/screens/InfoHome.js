import React from 'react'
import {View, 
        Text, 
        StyleSheet, 
        FlatList, 
        Dimensions, 
        ActivityIndicator, 
        TouchableOpacity,
        StatusBar } 
from 'react-native'
import firebase from 'firebase'
import { Avatar, Icon, Image } from 'react-native-elements'
import call from 'react-native-phone-call'
import destination from '../Img/destination.png'

class InfoHome extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data:[],
            posts:[],
            avatar: '',
            userInfo:{},
            infoHome:{},
            loading: null
        }
    }
    componentWillMount(){
        this.setState({loading: true})
    }
    async handleAvarProfile(){
        try{
            const response = await firebase.storage().ref('Avatar/').child(`/${this.props.navigation.getParam('userId')}/`).child('avatar').getDownloadURL()
            .then((url)=>{
                this.setState({avatar: url})
            })
        }
        catch(err){

        }
    }
    async handleUserHomeImage(){
        try{
            const response = await firebase.storage().ref('Users/').child(`/${this.props.navigation.getParam('userId')}/${this.props.navigation.getParam('storage')}/`).list()
        .then((url)=>{
            const m = url.items.map((Element)=>{
                Element.getDownloadURL().then((e)=>{
                    const response = { uri : e}
                    this.setState({ data: [...this.state.data,response], loading: false })
                })
            })
        })
        .catch(()=>{
            this.setState({loading: false})
        })
        }
        catch(err){

        }
    }
    async handleUserHome(){
        try{
            const response = await firebase.database().ref(`/Users/${this.props.navigation.getParam('userId')}`)
            .once('value',snapshot=>{
                this.setState({userInfo: snapshot.val()})
            })
        }
        catch(err){

        }
    }
    async handleInfoHome(){
        try{
            const response = await firebase.database().ref(`/Post/${this.props.navigation.getParam('userId')}`)
            .once('value',snapshot=>{
                this.setState({infoHome: snapshot.val()})
            })
        }
        catch(err){
            
        }
    }
    handleImage(item){
        return(
            <Text>{item.name}</Text>
        )
    }
    handleCall(){
        try{
            const {  phoneNumber } = this.state.userInfo 
            const  args = {
                number: phoneNumber,
                prompt: false
        }
        call(args).catch(err)
        }
        catch(err){
            console.log(err)
        }
    }
    async handlePosts(){
        try{
            const response = await firebase.database().ref(`/Post/${this.props.navigation.getParam('userId')}/`)
                .on('value',snapshot=>{
                    this.setState({posts: [...this.state.posts,Object.values(snapshot.val())]})
                })
        }
        catch(err){

        }
    }
    componentDidMount(){
        this.handlePosts()
        this.handleAvarProfile()
        this.handleUserHomeImage()
        this.handleUserHome()
        this.handleInfoHome()
    }
    render(){
        const { name, lastName, phoneNumber  } = this.state.userInfo  
        const { avatar } = this.state
        const posts = JSON.stringify(this.state.posts)

        return(
            <View style={styles.container}>
                <StatusBar backgroundColor='#2B2B2B'/>
                <View style={styles.header}>
                        <TouchableOpacity
                        onPress={()=> this.props.navigation.navigate('ProfileUser',
                            {  avatar: avatar,
                               name: name, 
                               lastName: lastName, 
                               posts: posts, 
                               phone: phoneNumber ,
                               storage: this.props.navigation.getParam('storage'),
                               latitudeUser: this.props.navigation.getParam('latitudeUser'),
                               longitudeUser: this.props.navigation.getParam('longitudeUser'),
                               userId: this.props.navigation.getParam('userId')
                            })}
                        >
                            <Avatar
                            containerStyle={{marginLeft: 12}}
                            rounded
                            icon={{name: 'user',type: 'font-awesome'}}
                            source={{ uri: this.state.avatar}}
                            size='large'
                            />
                        </TouchableOpacity>
                        <View style={{flexDirection:'column',alignItems:'flex-start',width:'40%',marginLeft: 14}}>
                            <View  style={{flexDirection:'row'}}>
                                <Text style={styles.infoContact}>{name} </Text>
                                <Text h style={styles.infoContact}>{lastName}</Text>
                            </View>
                            <View>
                                <Text style={styles.infoContact}>{phoneNumber}</Text>
                            </View>
                        </View>
                        <View style={{width: '25%',alignItems:'flex-end'}}>
                            <TouchableOpacity onPress={()=> this.handleCall()}>
                                <Icon
                                size={48}
                                name='phone'
                                color= '#35FF62'
                                />
                            </TouchableOpacity>
                        </View>
                </View>
                <View style={styles.main}> 
                    <Text style={styles.infoHomeLocation}>disponivél</Text>
                    <View style={{flexDirection:'row'}}>
                        <View style={{width: '50%'}}>
                            <Text style={styles.infoHome}>tipo do imovél : {this.props.navigation.getParam('home')}</Text>
                            <Text style={styles.infoHome}>comôdos: {this.props.navigation.getParam('space')} peças</Text>
                            <Text style={styles.infoHome}>valor: {this.props.navigation.getParam('price')}</Text>
                        </View>
                        <View style={{width: '50%', alignItems:'center',marginLeft: 30}}>
                            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Router',{
                                latitude: this.props.navigation.getParam('latitude'),
                                longitude: this.props.navigation.getParam('longitude'),
                                latitudeUser: this.props.navigation.getParam('latitudeUser'),
                                longitudeUser: this.props.navigation.getParam('longitudeUser'),
                                home: this.props.navigation.getParam('home')
                            })}>
                                <Image style={{width:60,height:60}} source={destination}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.footer}>
                    { this.state.loading === true ?  
                    <View style={{ flex:1,justifyContent:'center',alignItems:'center'}}>
                        <ActivityIndicator size='large' color='#3B5998'/>
                    </View>
                    :
                    <FlatList
                    horizontal
                    data={this.state.data}
                    renderItem={({item})=> {
                        return(
                            <View>
                                <Image 
                                style={styles.imgs} 
                                source={item}
                                PlaceholderContent={<ActivityIndicator size='large' color='#3B5998'/>}
                                />
                            </View>
                        )
                    }}
                    keyExtractor={(item,index)=> index.toString()}
                    />
                    }
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection:'column',
        backgroundColor:'#1A1A1A'
    },
    imgs:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * 3/4,
        marginRight: 8
    },
    infoContact:{
        color:'#1A1A1A',
        fontWeight:'bold',
        textAlign:'center',
        textTransform:'uppercase',
        marginTop:4,
        fontSize: 13
    },
    infoHome:{
        fontSize: 13,
        color:'#1A1A1A',
        textTransform:'uppercase',
        marginLeft: 10,
        textAlign:'left',
        margin:4
    },
    infoHomeLocation:{
        color:'#1A1A1A',
        fontWeight:'bold',
        textTransform:'uppercase',
        marginBottom: 16,
        textAlign:'center',
        margin:4,
        fontSize: 13
    },
    header:{
        flexDirection:'row',
        flex: 0.5,
        alignItems:'center',
        margin: 8,
        backgroundColor:'#7966FF',
        borderRadius: 4
    },
    main:{
        flex:0.8,
        flexDirection:'column',
        marginBottom:6,
        marginLeft: 8,
        marginRight: 8,
        backgroundColor:'#7966FF',
        justifyContent:"center",
        borderRadius: 4
    },
    footer:{
        flex: 1.1,
        alignItems:'center'
    },
    avatar_contact:{
        
    }
})
export default InfoHome

