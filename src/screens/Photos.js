import React from 'react'
import { View, FlatList, Text, StyleSheet, Image, Dimensions} from 'react-native'
import firebase from 'firebase'

class Photos extends React.Component{
    constructor(props){
        super(props)
            this.state = {
                data:[]
            }
    }
    async handleUserHomeImage(){
        try{
            const response = await firebase.storage().ref('Users/').child(`/${this.props.navigation.getParam('userId')}/${this.props.navigation.getParam('storage')}/`).list()
        .then((url)=>{
            const m = url.items.map((Element)=>{
                Element.getDownloadURL().then((e)=>{
                    const response = { uri : e}
                    this.setState({ data: [...this.state.data,response] })
                })
            })
        })
        .catch(()=>{
            
        })
        }
        catch(err){

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
                <FlatList
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