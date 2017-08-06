import React, {
  Component
}
from 'react';
import moment from 'moment';
moment.locale('ru');
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
require("react-tap-event-plugin")();
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
}
from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentSave from 'material-ui/svg-icons/content/save';
import ContentEdit from 'material-ui/svg-icons/content/flag';
import {
  TextField,
  SelectField,
  MenuItem,
  DatePicker
}
from 'material-ui';
import * as firebase from 'firebase';
import config from '../configDB';
import Login from './Login';
import { style, tableParams, tableColumns, nameColToType, itemsToSelect, linkBetweenColAndText } from './constants';

class App extends Component {

  constructor(props) {
    super(props);
    firebase.initializeApp(config);

    this.state = {
      loggedIn: false,
      login: '',
      password: '',
      showAddRow: false,
      tableData: [],
      newRow: {
        id: 1,
        date: new Date(),
        product: '',
        country: '',
        delivery: 0,
        paymentMethod: 0,
        currency: 0,
        revenues: ''
      }
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => this.setState({ loggedIn: Boolean(user) }));

    const tableDataRef = firebase.database().ref().child('tableData');
    tableDataRef.on("value", snap => this.setState({ tableData: JSON.parse(snap.val()) }));
  }

  handleChangeSel = (fieldName, event, index, value) => {
    let modNewRow = { ...this.state.newRow };
    modNewRow[fieldName] = value;

    this.setState({
      newRow: modNewRow
    });
  }

  handleChange = (fieldName, event, value) => {
    let modNewRow = { ...this.state.newRow };
    modNewRow[fieldName] = value;

    this.setState({
      newRow: modNewRow
    });
  }

  handleRowSel = selectedRowIndexes => {
    this.setState({
      selectedRowIndex: selectedRowIndexes[0]
    });
  }

  handlerAddButClick = event => {
    this.setState(prevState => {
      return {
        showAddRow: !prevState.showAddRow
      };
    });
  }

  handlerSaveButClick = event => {
    if (!this.state.showAddRow) {
      return false;
    }

    let modTableData = [...this.state.tableData];
    let modNewRow = { ...this.state.newRow };

    modNewRow.revenuesInBYN = modNewRow.revenues;
    modNewRow.uid = Date.now();
    modTableData.push(modNewRow);

    firebase.database().ref('tableData').set(JSON.stringify(modTableData));

    this.setState({
      showAddRow: false
    });
  }

  handlerEditButClick = event => {
    const selectedRowIndex = this.state.selectedRowIndex;

    if (selectedRowIndex === undefined) {
      return false;
    }

    let modTableData = [...this.state.tableData];
    const editRow = modTableData[selectedRowIndex];
    modTableData.splice(selectedRowIndex, 1);
    this.setState({
      tableData: modTableData,
      newRow: editRow,
      showAddRow: true
    });
  }

  handlerRemoveButClick = event => {
    const selectedRowIndex = this.state.selectedRowIndex;

    if (selectedRowIndex === undefined) {
      return false;
    }

    let modTableData = [...this.state.tableData];
    modTableData.splice(selectedRowIndex, 1);
    firebase.database().ref('tableData').set(JSON.stringify(modTableData));
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          {!this.state.loggedIn ? 
          <Login />
          :
          <div>
            <Table
              height={tableParams.height}
              fixedHeader={tableParams.fixedHeader}
              fixedFooter={tableParams.fixedFooter}
              selectable={tableParams.selectable}
              multiSelectable={tableParams.multiSelectable}
              onRowSelection={this.handleRowSel}
            >
              <TableHeader
                displaySelectAll={tableParams.showCheckboxes}
                adjustForCheckbox={tableParams.showCheckboxes}
                enableSelectAll={tableParams.enableSelectAll}
              >
                <TableRow>
                  {tableColumns.map((item,i) => <TableHeaderColumn key={i}>{linkBetweenColAndText[item]}</TableHeaderColumn>)}
                </TableRow>
              </TableHeader>
              <TableBody
                displayRowCheckbox={tableParams.showCheckboxes}
                deselectOnClickaway={tableParams.deselectOnClickaway}
                showRowHover={tableParams.showRowHover}
                stripedRows={tableParams.stripedRows}
              >
                {this.state.tableData.map(row => {
                  return (
                    <TableRow key={row.uid}>
                      {tableColumns.map((colunm,i) => {
                      return (
                      <TableRowColumn key={i}>{
                        nameColToType[colunm] === 'DatePicker' ? moment(row[colunm]).format('L') :
                          nameColToType[colunm] === 'TextField' ? row[colunm] :
                          itemsToSelect[colunm].items.find(({code}) => code === row[colunm]).name
                      }</TableRowColumn>)})}
                  </TableRow>);
                })}
                {this.state.showAddRow && (
                  <TableRow selectable={false}>
                    {tableColumns.map((colunm,i) => {
                      return (
                        <TableRowColumn>
                        {
                        nameColToType[colunm] === 'DatePicker' ? 
                          <DatePicker 
                            key={i}
                            autoOk={true}
                            hintText="Дата"
                            value={this.state.newRow[colunm]} 
                            onChange={this.handleChange.bind(this,colunm)} 
                          /> :
                          nameColToType[colunm] === 'TextField' ? 
                            <TextField
                              key={i}
                              hintText={linkBetweenColAndText[colunm]}
                              value={this.state.newRow[colunm]}
                              onChange={this.handleChange.bind(this,colunm)}
                            /> :
                              <SelectField
                                key={i}
                                value={this.state.newRow[colunm]}
                                onChange={this.handleChangeSel.bind(this,colunm)}
                              >
                              {itemsToSelect[colunm].items.map(menuitem => <MenuItem key={menuitem.code} value={menuitem.code} primaryText={menuitem.name} />)}
                            </SelectField>
                        }
                        </TableRowColumn>);
                    })}
                  </TableRow>
                )}
              </TableBody>
              <TableFooter
                adjustForCheckbox={tableParams.showCheckboxes}
              >
                <TableRow>
                 {tableColumns.map((item,i) => <TableHeaderColumn key={i}>{linkBetweenColAndText[item]}</TableHeaderColumn>)}
                </TableRow>
              </TableFooter>
          </Table>
          <div>
            <FloatingActionButton onClick={this.handlerAddButClick} style={style}>
              <ContentAdd />
            </FloatingActionButton>
            <FloatingActionButton onClick={this.handlerSaveButClick} backgroundColor="green" style={style}>
              <ContentSave />
            </FloatingActionButton>
            <FloatingActionButton onClick={this.handlerEditButClick} backgroundColor="yellow" style={style}>
              <ContentEdit />
            </FloatingActionButton>
            <FloatingActionButton onClick={this.handlerRemoveButClick} backgroundColor="red" style={style}>
              <ContentRemove />
            </FloatingActionButton>
          </div>
        </div>}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
