import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity, TextInput} from 'react-native';
import{Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';

import db from '../config.js';
import { ScrollView } from 'react-native-gesture-handler';
import { RFValue } from "react-native-responsive-fontsize";


export default class PostDetails extends Component{
  constructor(props){
    super(props);
    this.state={
      userId          : firebase.auth().currentUser.email,
      recieverId      : this.props.navigation.getParam('details')["user_id"],
      requestId       : this.props.navigation.getParam('details')["request_id"],
      postDocId : '',
      user_name:"",
      post:"",
      commenters_username:"",
      comment:"",
    }
  }

  getRecieverDetails(){
    db.collection('posted_goals').where('request_id','==',this.state.requestId).get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
        this.setState({
          user_name : doc.data().username,
          post : doc.data().post,
          postDocId : doc.id
        })
      })
    });
}

getCommentersUsername(){
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      this.setState({
        commenters_username : doc.data().user_name
      })
    })
  });
}


addNotification = () => {
  var comment =
    this.state.commenters_username + " has commented, " + this.state.comment;
  db.collection("all_notifications").add({
    targeted_user_id: this.state.recieverId,
    commenter_id: this.state.userId,
    request_id: this.state.requestId,
    date: firebase.firestore.FieldValue.serverTimestamp(),
    notification_status: "unread",
    comment: comment,
  });
};

addRate = () => {
  var comment =
    "You recently rated " + this.state.user_name + " on the following categories";
  db.collection("all_given_rates").add({
    targeted_user_id: this.state.recieverId,
    commenters_id: this.state.userId,
    request_id: this.state.requestId,
    date: firebase.firestore.FieldValue.serverTimestamp(),
    comment: comment,
  });
};


  // getUserDetails=(userId)=>{
  //   db.collection("users").where('email_ID','==', userId).get()
  //   .then((snapshot)=>{
  //     snapshot.forEach((doc) => {
  //       this.setState({
  //         user_name  :doc.data().first_name + " " + doc.data().last_name
  //       })
  //     })
  //   })
  // }


  componentDidMount(){
    this.getRecieverDetails()
    this.getCommentersUsername()
    // this.getUserDetails(this.state.userId)
  }


    render(){
      return(
        
        <View style={styles.container}>
          <ScrollView>
          <View style={{flex:0.1}}>
            <Header
              leftComponent ={<Icon name='arrow-left' type='feather' color='#fff'  onPress={() => this.props.navigation.goBack()}/>}
              centerComponent={{ text:"Details", style: { color: '#fff', fontSize:26, fontFamily:'frontage' } }}
              backgroundColor = '#101214'

            />
          </View>
          <View style={{flex:0.45,}}>
            <Card
                title={this.state.user_name + "'s post"}
                titleStyle= {{fontSize : 29, fontFamily:"nunito-l"}}
              >
              <Card>
                <View style = {{flexDirection:"row"}}>
                <Text style={{fontSize : 16, fontFamily:"nunito-l"}}>{this.state.post}</Text>
                </View>
              </Card>
            </Card>

            <Card
                title={"Comments"}
                titleStyle= {{fontSize : 22, fontFamily:"nunito-l"}}
              >
              <Card>
                <View style = {{flexDirection:"row"}}>
                <TextInput
                  style={styles.valueInput}
                  placeholder={"Say something..."}
                  maxLength={50}
                  onChangeText={(text) => {
                    this.setState({
                      comment: text,
                    });
                  }}
                  comment = {this.state.comment}
                />
                </View>
              </Card>
            </Card>
          </View>
          <View style={styles.buttonContainer}>
            {
              this.state.recieverId !== this.state.userId
              ?(
                <TouchableOpacity
                    style={styles.button}
                    onPress={()=>{
                      this.addNotification()
                      this.props.navigation.navigate('MyRatesScreen')
                    }}>
                  <Text style={{color:'#5CDB94', fontFamily: 'nunito-l',}}>Comment!</Text>
                </TouchableOpacity>
              )
              : null
            }
          </View>
          </ScrollView>
        </View>
        
        
      )
    }

}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#101214'
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:200,
    height:50,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 20,
    backgroundColor: '#05386B',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16,
    margin:20
  },
  valueInput: {
    width: "90%",
    height: RFValue(40),
    borderWidth:1.2,
    borderRadius:20,
    borderColor:"#05386B",
    marginLeft:"5%",
    fontFamily: 'nunito-l',
    fontSize:15,
    paddingLeft : 13
  },
})
