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
import {
  TextField,
  SelectField,
  MenuItem,
  DatePicker,
  RaisedButton
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
      showAddRow: false,
      tableData: [],
      newRow: {
        date: new Date(),
        product: '',
        country: '',
        delivery: 0,
        paymentMethod: 0,
        currency: 0,
        revenues: 0,
        revenuesInBYN: 0
      }
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.userUID = user.uid;
      this.setState({ loggedIn: Boolean(user) });

      const tableDataRef = firebase.database().ref().child(`tableData/${this.userUID}`);
      tableDataRef.on("value", snap => {
        const tableData = JSON.parse(snap.val())
          .map(item => {
            item.date = new Date(item.date);
            return item;
          })
          .sort(({ date }, { date: otherDate }) => date - otherDate);
        this.setState({ tableData });
      });
    });

    document.addEventListener('keydown', event => {
      const { keyCode } = event;
      const enter = 13;
      if (keyCode !== enter) {
        return false;
      }

      const { loggedIn } = this.state;

      if (loggedIn) {
        this.saveDataHandler();
      }
    });
  }

  onSelectChange = (fieldName, event, index, value) => {
    let modNewRow = { ...this.state.newRow };
    modNewRow[fieldName] = value;

    this.setState({
      newRow: modNewRow
    });
  }

  onFieldChange = (fieldName, event, value) => {
    let modNewRow = { ...this.state.newRow };
    modNewRow[fieldName] = value;

    this.setState({
      newRow: modNewRow
    });
  }

  selectRowHandler = selectedRowIndexes => {
    this.setState({
      selectedRowIndex: selectedRowIndexes[0]
    });
  }

  addRowHandler = event => {
    this.setState(prevState => {
      return {
        showAddRow: !prevState.showAddRow
      };
    });
  }

  saveDataHandler = event => {
    if (!this.state.showAddRow) {
      return false;
    }

    let modTableData = [...this.state.tableData];
    let modNewRow = { ...this.state.newRow };

    if (!modNewRow.currency) {
      modNewRow.revenuesInBYN = modNewRow.revenues;
    }
    modNewRow.uid = Date.now();
    modTableData.push(modNewRow);

    firebase.database().ref(`tableData/${this.userUID}`).set(JSON.stringify(modTableData));

    this.setState({
      showAddRow: false
    });
  }

  editRowHandler = event => {
    const selectedRowIndex = this.state.selectedRowIndex;

    if (selectedRowIndex === undefined) {
      alert('Ни одна строка не выделена!');
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

  removeRowHandler = event => {
    const selectedRowIndex = this.state.selectedRowIndex;

    if (selectedRowIndex === undefined) {
      return false;
    }

    let modTableData = [...this.state.tableData];
    modTableData.splice(selectedRowIndex, 1);
    firebase.database().ref(`tableData/${this.userUID}`).set(JSON.stringify(modTableData));
  }

  signOutHandler = () => {
    firebase.auth().signOut().then(
      () => this.setState({ loggedIn: false }),
      error => alert(`Ошибка выхода из системы: ${error.message}`)
    );
  }

  render() {
    let revenuesInBYNSum = 0;
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
              onRowSelection={this.selectRowHandler}
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
                {this.state.tableData.map((row,j) => {
                  return (
                    <TableRow key={row.uid}>
                      {tableColumns.map((colunm,i) => {
                      colunm === 'revenuesInBYN' ? revenuesInBYNSum += Number(row[colunm]) : '';
                      return (
                        colunm === 'id' ? 
                        <TableRowColumn>{j + 1}</TableRowColumn>
                        :
                        <TableRowColumn key={i}>
                          {nameColToType[colunm] === 'DatePicker' ? moment(row[colunm]).format('L') :
                            nameColToType[colunm] === 'TextField' ? row[colunm] :
                            itemsToSelect[colunm].items.find(({code}) => code === row[colunm]).name}
                        </TableRowColumn>)})}
                    </TableRow>);
                })}
                {this.state.showAddRow && (
                  <TableRow selectable={false}>
                    {tableColumns.map((colunm,i) => {
                      return (
                        colunm === 'id' ? 
                        <TableRowColumn disabled={true}>{this.state.tableData.length + 1}</TableRowColumn>
                        :
                        <TableRowColumn>
                        {
                        nameColToType[colunm] === 'DatePicker' ? 
                          <DatePicker 
                            key={i}
                            autoOk={true}
                            hintText="Дата"
                            value={this.state.newRow[colunm]} 
                            onChange={this.onFieldChange.bind(this,colunm)} 
                          /> :
                          nameColToType[colunm] === 'TextField' ? 
                            <TextField
                              key={i}
                              hintText={linkBetweenColAndText[colunm]}
                              value={this.state.newRow[colunm]}
                              onChange={this.onFieldChange.bind(this,colunm)}
                            /> :
                              <SelectField
                                key={i}
                                value={this.state.newRow[colunm]}
                                onChange={this.onSelectChange.bind(this,colunm)}
                              >
                              {itemsToSelect[colunm].items.map(menuitem => <MenuItem key={menuitem.code} value={menuitem.code} primaryText={menuitem.name} />)}
                            </SelectField>
                        }
                        </TableRowColumn>);
                    })}
                  </TableRow>
                )}
              </TableBody>
              <TableFooter adjustForCheckbox={tableParams.showCheckboxes}>
                <TableRow>
                 {tableColumns.map((item,i) => <TableHeaderColumn key={i}>{linkBetweenColAndText[item]}</TableHeaderColumn>)}
                </TableRow>
              </TableFooter>
          </Table>
          <h2>{`Итоговая выручка ${revenuesInBYNSum} BYN`}</h2>
          <div>
            <RaisedButton label="Добавить" onClick={this.addRowHandler} primary={true} style={style} />
            <RaisedButton label="Редактировать" onClick={this.editRowHandler} style={style} backgroundColor="orange"/>
            <RaisedButton label="Удалить" onClick={this.removeRowHandler} style={style} backgroundColor="red"/>
            <RaisedButton label="Сохранить" onClick={this.saveDataHandler} style={style} backgroundColor="green"/>
            <RaisedButton label="Выйти" onClick={this.signOutHandler} style={style} />
          </div>
        </div>}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
