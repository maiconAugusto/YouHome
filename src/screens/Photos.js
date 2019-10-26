import React from 'react'
import { View, FlatList, ActivityIndicator, StyleSheet, Image, Dimensions} from 'react-native'
import firebase from 'firebase'

class Photos extends React.Component{
    constructor(props){
        super(props)
            this.state = {
                data:[],
                loading: false
            }
    }
    componentWillMount(){
        this.setState({loading: true})
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
            this.setState({loading: false})
        }
    }
    componentDidMount(){
        console.log(this.props.navigation.getParam('userId'))
        console.log(this.props.navigation.getParam('storage'))
        this.handleUserHomeImage()
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={{alignItems:'center',justifyContent:'center'}}>
                    { this.state.loading == true ? 
                    <ActivityIndicator style={{marginTop: 90}} size='large' color='#3B5998'/>
                    : null}
                </View>
                <FlatList
                style={{flex:1}}
                data={this.state.data}
                renderItem={({item})=> {
                    return(
                        <Image style={styles.imgs} source={item}/>
                    )
                }}
                keyExtractor={(item,index)=> index.toString()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection:'column',
        backgroundColor:'#D4D8E8'
    },
    imgs:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * 3/4,
        marginRight: 8,
        marginBottom: 8
    },
})
export default Photos