import React, { Component } from 'react';

import logo from './logo.svg';
import getCaretCoordinates from 'textarea-caret';
import './App.css';
import Grid from './grid'
import InputBox from './inputBox'
import 'semantic-ui-css/semantic.min.css';

class App extends Component {
  constructor(){
    super()
    this.state={
      caret:{display:'none'},
      suggestionOn:false,
      cval:"",
      selection:-1,
      listItem:[],
      placeholder:"",
      start:0,
      end:undefined
    }
  }

  createList=()=>{
    if(this.state.listItem.length===0)
    return <li className="list-group-item">{this.state.placeholder}</li>
    return this.state.listItem.map((item,index)=>{
      var cn="item"
      if(index===this.state.selection)
      cn=cn+" active"
      if(index===0)
      return <div role='listitem'  tabIndex="1"  key={item} className={cn} ref={(input) => { this.listItemEle = input }}>{item}</div>
      else
      return <div role='listitem'  tabIndex="1"  key={item} className={cn}>{item}</div>

    })

  }
  
  handleSideArrow=()=>{
    
  }

  getSuggestions = (value) => {

    const inputValue = value.toLowerCase();
    this.setState({placeholder:"Loading..."})
    const inputLength = inputValue.length;
    fetch(`https://inputtools.google.com/request?text=${inputValue}&itc=mr-t-i0-und&num=13&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`)
    
                .then(resp => resp.json())
                .then(suggestions =>{
                  try{
                    var res=suggestions[1][0][1];
                    if(res.length>0)
                    this.setState({listItem:res})
                    else{
                      this.setState({placeholder:"Not Found"})
                    }
                  }
                  catch(e){
                    this.setState({placeholder:"Not Found"})
                  }
                });
  };

  moveListI   

  keyD=(e)=>{
    
    
    if(!e.ctrlKey){
    if(e.keyCode===13){//enter
      if(this.state.suggestionOn)
      {
      e.preventDefault();

      this.setState({suggestionOn:false,caret:{display:'none'},cval:"",listItem:[]});

    
      e.target.value = [e.target.value.slice(0, e.target.selectionEnd), this.state.listItem[this.state.selection], e.target.value.slice(e.target.selectionEnd)].join('')+" ";

      } 
      return;
    }

    if(e.keyCode===40 && this.state.suggestionOn)
    {
      e.preventDefault();
    this.setState({selection:this.state.selection+1>this.state.listItem.length-1?0:this.state.selection+1})
      return;
  }if(e.keyCode===38 && this.state.suggestionOn)
    {
      e.preventDefault();
      this.setState({selection:this.state.selection-1<0?this.state.listItem.length-1:this.state.selection-1})
      return;
    }if(e.keyCode ===27)
    {
    this.setState({caret:{display:'none'},suggestionOn:false,cval:""})
      return;
  }
if(e.keyCode===32 ) // space backspace
{
this.setState({caret:{display:'none'},suggestionOn:false,cval:""})
if(this.state.cval!=="")
{e.target.value=e.target.value+this.state.listItem[0]+" ";
e.preventDefault();
}return;

}
if(e.keyCode===8)
{
  if(this.state.cval.length>0)
  {
    e.preventDefault();
  }
  var tempCurrVal=this.state.cval.slice(0,this.state.cval.length-1);
  this.setState({cval:tempCurrVal,suggestionOn:tempCurrVal!==""?true:false,caret:tempCurrVal!==""?this.state.caret:{display:'none'}},()=>{
    if(this.state.cval!=="")
    this.getSuggestions(this.state.cval)
  })
  return;
}
  if(e.keyCode > 48 && e.keyCode<91 )
  {
    var currentPos=getCaretCoordinates(e.target,e.target.selectionEnd);
    e.preventDefault();
    if(e.target.offsetHeight<currentPos.top)
    currentPos['top']=e.target.offsetHeight
    else
    currentPos['top']=currentPos.top+20
    currentPos['left']=currentPos['left']+20
    this.setState({caret:Object.assign({},currentPos,{
      display:'block',
      height:'auto',
      'zIndex':'2',position:'absolute'}),
    selection:0,
    suggestionOn:true,
    cval:this.state.cval+e.key
      },()=>{
        this.getSuggestions(this.state.cval)

      });
    }}
  }
  render() {
    return (
      <div>


      <div class='ui input'>
          <input 

          onKeyDown={this.keyD}  
          tabIndex={1}
          />
          </div>
          <div   role='list' className="ui list" style={this.state.caret} >
                <div  role='listitem' className="item">{this.state.cval}</div>
                {this.createList()}
                
            </div>  



              </div>      
    );
  }
}

export default App;
