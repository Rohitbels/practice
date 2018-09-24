import React, { Component } from 'react';
import getCaretCoordinates from 'textarea-caret';
import ReactDOM from 'react-dom'



class AutoSugg extends Component {
  constructor(){
    super()
    this.myRef = React.createRef();
    this.state={
      caret:{display:'none'},
      suggestionOn:false,
      cval:"",
      selection:-1,
      listItem:[],
      result:"",
      placeholder:"",
      start:0,
      end:undefined,
      caretPos:""
    }
  }

  createList=()=>{
    if(this.state.listItem.length===0)
    return <li className="list-group-item">{this.state.placeholder}</li>
    return this.state.listItem.map((item,index)=>{
      var cn="list-group-item"
      if(index===this.state.selection)
      cn=cn+" active"
      if(index===0)
      return <li role='listitem'  tabIndex="1"  key={item} className={cn} ref={(input) => { this.listItemEle = input }}>{item}</li>
      else
      return <li role='listitem'  tabIndex="1"  key={item} className={cn}>{item}</li  >

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

      this.setState({suggestionOn:false,caret:{display:'none'},cval:"",listItem:[]
    ,result:[e.target.value.slice(0, e.target.selectionEnd), this.state.listItem[this.state.selection], e.target.value.slice(e.target.selectionEnd)].join('')+" "
    });

        
      //e.target.value = [e.target.value.slice(0, e.target.selectionEnd), this.state.listItem[this.state.selection], e.target.value.slice(e.target.selectionEnd)].join('')+" ";

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
{
    //e.target.value=e.target.value+this.state.listItem[0]+" ";
this.setState({result:e.target.value+this.state.listItem[0]+" "});
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
  this.setState({cval:tempCurrVal,suggestionOn:tempCurrVal!==""?true:false,caret:tempCurrVal!==""?this.state.caret:{display:'none'}
  ,
  result:this.state.result.slice(0,e.target.selectionEnd-1)+this.state.result.slice(e.target.selectionEnd)
,caretPos:e.target.selectionEnd-1
},()=>{
    this.myRef.current.setSelectionRange(this.state.caretPos, this.state.caretPos)
    if(this.state.cval!=="")
    this.getSuggestions(this.state.cval)
  })
  console.log(this.state.result)
  return;
}
  if(e.keyCode > 48 && e.keyCode<91 )
  {
    var currentPos=getCaretCoordinates(e.target,e.target.selectionEnd);
    e.preventDefault();
    if(e.target.offsetHeight<currentPos.top)
    currentPos['top']=e.target.offsetHeight
    else
    currentPos['top']=currentPos.top;
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
    this.setState({result:e.target.value})
}

getValue=()=>{
    return {"task":this.state.result};
  };
  getInputNode = () => {
    return ReactDOM.findDOMNode(this).getElementsByTagName('input')[0];
  };

componentDidUpdate=()=>{
    this.myRef.current.setSelectionRange(this.state.caretPos, this.state.caretPos);
}
  render() {
    
    return (
      <div>


      <div class='ui input'>
          <input 
          className="form-control"
          onKeyDown={this.keyD}  
          tabIndex={1}
          value={this.state.result}
          ref={this.myRef}
          />
          </div>
          <ul   role='list' className="list-group" style={this.state.caret} >
                <li  role='listitem' className="list-group-item">{this.state.cval}</li>
                {this.createList()}

            </ul> 

              </div>      
    );
  }
}

export default AutoSugg;
