import update from 'immutability-helper';
import InputBox from './inputBox';
import MyContextMenu from './contextMenu';
import RowRenderer from './rRender'
const ReactDataGrid = require('react-data-grid');
const React = require('react');

export const UserContext = React.createContext({
  highlightedCells: [1,2],
  update:(add)=>{
    this.highlightedCells.concat([3])
  }
});


const { Editors, Formatters } = require('react-data-grid-addons');

console.log(Editors)
const { AutoComplete, DropDownEditor } = Editors;
const { DropDownFormatter } = Formatters;
var sea=function(r){
  console.log(r)
}
// options for priorities autocomplete editor
const priorities = [{ id: 0, title: 'Criticalqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq' }, { id: 1, title: 'High' }, { id: 2, title: 'Medium' }, { id: 3, title: 'Low'} ];
const PrioritiesEditor = <AutoComplete  options={priorities} />;


// options for IssueType dropdown editor
// these can either be an array of strings, or an object that matches the schema below.
const issueTypes = [
  { id: 'bug', value: 'bug', text: 'Bug', title: 'Bug' },
  { id: 'improvement', value: 'improvement', text: 'Improvement', title: 'Improvement' },
  { id: 'epic', value: 'epic', text: 'Epic', title: 'Epic' },
  { id: 'story', value: 'story', text: 'Story', title: 'Story' }
];
const IssueTypesEditor = <DropDownEditor options={issueTypes}/>;

const IssueTypesFormatter = <DropDownFormatter options={issueTypes} value="bug"/>;

export default class Grid extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._columns = [
      {
        key: 'id',
        name: 'ID',
        width: 80
      },
      {
        key: 'task',
        name: 'Title',
        editor: InputBox
      },
      {
        key: 'priority',
        name: 'Priority',
        editor: PrioritiesEditor
      },
      {
        key: 'issueType',
        name: 'Issue Type',
        editor: IssueTypesEditor,
        formatter: IssueTypesFormatter
      }
    ];

    this.state = { rows: this.createRows(10),
      highlightedCells:[]
    };
  }

  createRows = (numberOfRows) => {
    let rows = [];
    for (let i = 1; i < numberOfRows; i++) {
      rows.push({
        id: i,
        task: 'Task ' + i,
        priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
        issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
        hidden:true
      });
    }

    return rows;
  };

  rowGetter = (i) => {
    return this.state.rows[i];
  };
  onKeyDown = (e) => {
    
     if (e.ctrlKey && e.keyCode === 65) {
    

       let rows = [];
       this.state.rows.forEach((r) =>{
         rows.push(Object.assign({}, r, {isSelected: true}));
       });

       this.setState({ rows });
     }

   };
  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let rows = this.state.rows.slice();

    if(!updated)
      return
    debugger
    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, {$merge:updated});
      rows[i] = updatedRow;
    }

    this.setState({ rows });
  };

  highlightCell=(data)=>{
    this.setState({
      highlightedCells:this.state.highlightedCells.concat(data)
    },()=>{    console.log(this.state.highlightedCells)});


  }

  render() {
    return (
      <UserContext.Provider>
        
      <ReactDataGrid
        contextMenu={<MyContextMenu onHighlightBue={this.highlightCell} />}
        enableCellSelect={true}
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.state.rows.length}
        minHeight={500}
        onGridRowsUpdated={this.handleGridRowsUpdated}
        onGridKeyDown={this.onKeyDown}
        rowRenderer={<RowRenderer highlightedCells={this.state.highlightedCells}/>}
        />
        </UserContext.Provider>);
  }
}

const exampleDescription = (
  <p>This example uses the built in <strong>Autocomplete</strong> editor for the priorities column and the <strong>DropdownEditor</strong> for the IssueType column. <strong>You must include the <code>react-data-grid.ui-plugins.js</code> package to use the built in editors.</strong></p>);
