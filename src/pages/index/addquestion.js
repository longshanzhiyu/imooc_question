import Taro,{Component} from '@tarojs/taro';
import {View, Text, Input, Textarea, Button} from '@tarojs/components';
import Dialog from './dialog';
import './addquestion.less';

export default class AddQuestion extends Component {
	
	btnCancel() {
			//需要调用上层组件方法 组件无法关闭自身
			this.props.onCloseQuestion&&this.props.onCloseQuestion();
		}

	btnOK(){
		//点击确定，采集数据，关闭窗体上传数据
		if (this.state.title&&this.state.des) {
			//调用父层组件 传递数据
			this.props.onReveiveQuestion&&this.props.onReveiveQuestion(this.state);
		} else {
			Taro.showToast({title:'请输入标题或描述',icon:'none'})
		}
	}

	changeTitle(event){
		this.setState({title:event.target.value})
	}

	changeDes(event){
		this.setState({des:event.target.value})
	}

	render(){
		return (
			<Dialog>
				<View className='add-question'>
					<View className='question-body'>
						<Input focus onInput={this.changeTitle.bind(this)} className='question-title' placeholder='请输入您的问题标题' />
						<Textarea onInput={this.changeDes.bind(this)} className='question-des' placeholder='请输入您的问题描述' />
						<View className='btn-group'>
							<Button onClick={this.btnOK.bind(this)} className='btn-questions ok'>确定</Button>
							<Button onClick={this.btnCancel.bind(this)} className='btn-questions cancle'>取消</Button>
						</View>
					</View>
				</View>
			</Dialog>
		)
	}
}