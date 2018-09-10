
import React from 'react'
import PropTypes from 'prop-types';
const { Menu: { ContextMenu, MenuItem, SubMenu } } = require('react-data-grid-addons');
// Create the context menu.
// Use this.props.rowIdx and this.props.idx to get the row/column where the menu is shown.
export default class MyContextMenu extends React.Component {
    static propTypes = {
          
      rowIdx: PropTypes.string.isRequired,
      idx: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    };
  
    onHighlightBue = (e,data) =>{
        console.log(this.props);
        this.props.onHighlightBue(data);
        
    }
    render() {
      const { idx, id, rowIdx } = this.props;
  
      return (
        <ContextMenu id={id}>
          <MenuItem data={{ rowIdx, idx }} onClick={this.onHighlightBue}>Highlight Blue</MenuItem>
        </ContextMenu>
      );
    }
  }