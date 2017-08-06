const constants = {
  style: {
    marginRight: 20,
  },
  tableParams: {
    fixedHeader: true,
    fixedFooter: true,
    stripedRows: true,
    showRowHover: true,
    selectable: true,
    multiSelectable: false,
    enableSelectAll: false,
    deselectOnClickaway: false,
    showCheckboxes: false
  },
  tableColumns: ['id', 'date', 'product', 'country', 'delivery', 'paymentMethod', 'currency', 'revenues', 'revenuesInBYN'],
  nameColToType: {
    id: 'TextField',
    date: 'DatePicker',
    product: 'TextField',
    country: 'TextField',
    delivery: 'SelectField',
    paymentMethod: 'SelectField',
    currency: 'SelectField',
    revenues: 'TextField',
    revenuesInBYN: 'TextField'
  },
  itemsToSelect: {
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
        });
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
        });
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
        });
      }
    }
  },
  linkBetweenColAndText: {
    id: '№п/п',
    date: 'Дата',
    product: 'Изделие',
    country: 'Страна назначения',
    delivery: 'Способ доставки',
    paymentMethod: 'Способ оплаты',
    currency: 'Валюта',
    revenues: 'Выручка',
    revenuesInBYN: 'Выручка, BYN'
  }
};
module.exports = constants;
