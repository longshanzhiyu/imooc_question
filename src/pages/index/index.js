import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import './index.less'
import AddQuestion from './addquestion';
import Dialog from './dialog';
import Yes from '../../img/yes.png';
import No from '../../img/no.png';

function getStore(key){
  let str=Taro.getStorageSync(key);
  if (!str) {
    return [];
  }
  return JSON.parse(str);
}

function setStore(key, obj) {
  let str = obj; 
  if (typeof obj=='object') {
    str=JSON.stringify(obj)
  }
  Taro.setStorageSync(key, str);
}

//编译时，走一次
// let arr=getStore('questions').map(item=>{
//   return {id:parseInt(Math.random()*10000),...item}
// })

// setStore('questions', arr)

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  state={
    showQuestionModal:false, //显示浮层
    questionList:getStore('questions')
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  addQuestion(){
    this.setState({showQuestionModal: true})
  }

  closeQuestion(){
    this.setState({showQuestionModal: false})
  }

  reveiveQuestion(options){
    let {questionList}=this.state;
    questionList.push({id:parseInt(Math.random()*10000),...options});
    this.setState({questionList:questionList}, ()=>{
      // console.log(this.state.questionList);
      setStore('questions', this.state.questionList)
    });
    this.closeQuestion();
  }

  //投票
  addVote(item){
    let {questionList} = this.state;
    if (item) {
        item.vote=item.vote?(item.vote+1):1; //处理票数
    }
    let newList = questionList.map(itemQuestion=>{
      if (itemQuestion.id==item.id) {
        itemQuestion={...item};
      }
      return itemQuestion
    })
    this.setState({questionList:newList}, ()=>{
      setStore('questions', this.state.questionList)
    })
  }
  //减票
  cutVote(item){
    let {questionList} = this.state;
    if (item) {
      item.vote=item.vote?((item.vote-1)>=0?(item.vote-1):0):0;
    }
    let newList = questionList.map(itemQuestion=>{
      if (itemQuestion.id==item.id) {
        itemQuestion={...item};
      }
      return itemQuestion
    })
    this.setState({questionList:newList}, ()=>{
      setStore('questions', this.state.questionList)
    })
  }

  render () {

    let{questionList,showQuestionModal}=this.state;
    let myList = questionList.sort((a,b)=>a.vote<b.vote)

    return (
      <View className='index'>
        <View className='title'>Taro问答实例</View>
        <View className='question-list'>
          {
            myList.map((item,index)=>{
              return (<View key={item.id} className='question'>
                        <View className='question-left'>
                          <View className='question-title'>{item.title}</View>
                          <View className='question-des'>{item.des}</View>
                        </View>
                        <View className='question-right'>
                          <Image onClick={this.addVote.bind(this,item)} className='img' src={Yes} />
                          <Text>{item.vote?item.vote:0}</Text>
                          <Image onClick={this.cutVote.bind(this,item)} className='img' src={No}/>
                        </View>
                     </View>)
            })
          }
        </View>
        {showQuestionModal?<AddQuestion onReveiveQuestion={this.reveiveQuestion.bind(this)} onCloseQuestion={this.closeQuestion.bind(this)} />:null}
        <Button onClick={this.addQuestion.bind(this)} className='btn-question'>提问</Button>
      </View>
    )
  }
}

