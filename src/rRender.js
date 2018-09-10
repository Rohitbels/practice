import  {Cell,Row} from 'react-data-grid';
import React,{Component} from 'react'

var t=[];
class CellRenderer extends Component {
    render() {      
//        const hl = this.context.shouldHighlight(this.props.rowData.id, this.props.column.key);
    var hl=true;

    console.log(this.props)
    var res=this.props.highlightedCells.filter((item)=>
        {
                if(this.props.rowIdx===item.rowIdx && this.props.idx===item.idx)
                    return true;
                else
                    return false;            
        })
    if(res.length>0 )
     hl=true;
     else
     hl=false;    
    return (
                
            <Cell {...this.props} className={hl?"cred":""}/>
           );
    }
}



export default class RowRenderer extends Component {
    render() {
        
        var g=this.props.highlightedCells;

        return <Row cellRenderer={(v) =>(<CellRenderer highlightedCells={g} {...v}/>)} ref="row" {...this.props} />;
    }
}