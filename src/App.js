import React, {
  Component
}
from 'react';
import request from 'superagent';
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

const style = {
  marginRight: 20,
};

const tableData = [{
  uid: 1,
  id: 1,
  date: new Date(),
  product: 'Пальто',
  country: 'Россия',
  delivery: 0,
  paymentMethod: 1,
  currency: 1,
  revenues: '133',
  revenuesInBYN: '133'
}];

const tableParams = {
  fixedHeader: true,
  fixedFooter: true,
  stripedRows: true,
  showRowHover: true,
  selectable: true,
  multiSelectable: false,
  enableSelectAll: false,
  deselectOnClickaway: false,
  showCheckboxes: false
};

const tableColumns = ['id', 'date', 'product', 'country', 'delivery', 'paymentMethod', 'currency', 'revenues', 'revenuesInBYN'];

const nameColToType = {
  id: 'TextField',
  date: 'DatePicker',
  product: 'TextField',
  country: 'TextField',
  delivery: 'SelectField',
  paymentMethod: 'SelectField',
  currency: 'SelectField',
  revenues: 'TextField',
  revenuesInBYN: 'TextField'
};

const itemsToSelect = {
  delivery: {
    items: [{
      code: 0,
      name: 'Почтой'
    }, {
      code: 1,
      name: 'Лично'
    }],
    handleChange: function(event, index, value) {
      this.setState({
        delivery: value
      })
    }
  },
  paymentMethod: {
    items: [{
      code: 0,
      name: 'Перевод'
    }, {
      code: 1,
      name: 'Наличные'
    }],
    handleChange: function(event, index, value) {
      this.setState({
        paymentMethod: value
      })
    }
  },
  currency: {
    items: [{
      code: 0,
      name: 'BYN'
    }, {
      code: 1,
      name: 'RUB'
    }],
    handleChange: function(event, index, value) {
      this.setState({
        currency: value
      })
    }
  }
};

const linkBetweenColAndText = {
  id: '№п/п',
  date: 'Дата',
  product: 'Изделие',
  country: 'Страна назначения',
  delivery: 'Способ доставки',
  paymentMethod: 'Способ оплаты',
  currency: 'Валюта',
  revenues: 'Выручка',
  revenuesInBYN: 'Выручка, BYN'
};

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {

      showAddRow: false,
      tableData: tableData,
      newRow: {
        id: tableData.length + 1,
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

  handleChangeSel = (fieldName, event, index, value) => {

    let modNewRow = {...this.state.newRow
    };
    modNewRow[fieldName] = value;

    this.setState({
      newRow: modNewRow
    });
  }

  handleChange = (fieldName, event, value) => {

    let modNewRow = {...this.state.newRow
    };
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
      }
    })
  }

  handlerSaveButClick = event => {

    if (!this.state.showAddRow) {
      return false;
    }

    let modTableData = [...this.state.tableData];
    let modNewRow = {...this.state.newRow
    };

    debugger;

    if (!modNewRow.currency) {
      modNewRow.revenuesInBYN = modNewRow.revenues;
      modNewRow.uid = Date.now();
      modTableData.push(modNewRow);

      this.setState({
        showAddRow: false,
        tableData: modTableData
      })
    }
    else {

      request
        .get('/API/ExRates/Rates/298?Periodicity=0')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          
          debugger;

          console.log(err);
          // Calling the end function will send the request
        });
    }


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
    this.setState({
      tableData: modTableData
    });
  }

  render() {

    return (
      <MuiThemeProvider>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          
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
                </TableRow>)
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
                      </TableRowColumn>)
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
      </MuiThemeProvider>
    );
  }
}

export default App;
