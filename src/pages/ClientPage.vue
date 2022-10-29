<template>
  <HeaderComponent title="Exchange Client"/>
  <div class="client-page content-wrapper">

    <div class="first-line">
      <div class="line-title">Client Page</div>
      <div class="line-title">Broker's Name: {{ brokerData.full_name }}</div>
      <div name="user_balance" class="line-title">Balance: ${{ Math.round(brokerData.balance) }}</div>
    </div>
    <div class="table">
      <table>
        <thead>
        <tr>
          <th>Stock Code</th>
          <th>Current Value</th>
          <th>Amount</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(stock, index) in availableStocksList" :key="stock.code">
          <td :name="'code'+index">{{ stock.code }}</td>
          <td>
            <div v-if="!this.$store.state.is_working">$---</div>
            <div v-else>${{ getCurrentValue(stock.code) }}</div>
          </td>
          <td>
            <div v-if="!this.$store.state.is_working">---</div>
            <div v-else>{{ getBrokerStockAmount(stock.code) }}</div>
          </td>
          <td>
            <div class="table-btns">
              <CustomButton class="table-btn" :disabled="!this.$store.state.is_working" @click1="() => {
                  this.isValueChangeDialogVisible = true;
                  this.chosenStockHistoryCode = stock.code;
              }">Change History
              </CustomButton>
              <CustomButton class="table-btn" :disabled="!this.$store.state.is_working" @click1="() => {
                this.tradeCode = stock.code;
                this.prepareTradeHistory(stock.code);
              }">Trade History
              </CustomButton>
              <CustomButton class="table-btn" :name="'buy'+index" :disabled="!this.$store.state.is_working" @click1="() => {
                this.code = stock.code;
                this.isBuyFormVisible = true;
              }">Buy/Sell
              </CustomButton>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <dialog class="dialog value-change-history-dialog" :open="isValueChangeDialogVisible">
    <IconButton icon_name="close" class="close-btn" @click="isValueChangeDialogVisible = false"/>
    <div class="wrapper">
      <div class="dialog-header-text">Value Change History</div>
      <StockHistoryChart class="chart" :stockCode="chosenStockHistoryCode"/>
    </div>
  </dialog>

  <dialog class="dialog buy-history-dialog" :open="isTradeHistoryDialogVisible">
    <IconButton icon_name="close" class="close-btn" @click="isTradeHistoryDialogVisible = false"/>
    <div class="wrapper">
      <div class="dialog-header-text">Trade History</div>
      <div class="table">
        <table>
          <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Value Per Stock</th>
            <th>Income</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(stock) in stocksHistory" :key="stock.name" :class="{
            buy: stock.amount > 0,
            sell: stock.amount < 0
          }">
            <td>{{ stock.date }}</td>
            <td>{{ Math.abs(stock.amount) }}</td>
            <td>${{ stock.price }}</td>
            <td>
              <div v-if="stock.amount > 0">
                <div class="green" v-if="stock.income >= 0">
                  ${{ stock.income }}
                </div>
                <div class="red" v-else>
                  -${{ Math.abs(stock.income) }}
                </div>
              </div>
              <div v-else>---</div>
            </td>
            <!--            <td :class="incomeStyle(stocksPartIncome(index))">${{ stocksPartIncome(index) }}</td>-->
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </dialog>

  <dialog class="dialog buy-form" :open="isBuyFormVisible">
    <div class="wrapper">
      <div class="dialog-header-text">Buy Stocks</div>
      <CustomButton name="buy_toggle_btn" class="switch-btn" @click1="() => {
        this.isBuyFormVisible = false;
        this.isSellFormVisible = true;
      }">Sell
      </CustomButton>
      <div class="params">
        <div class="params-names">
          <div class="params-text">Amount:</div>
          <div class="params-text">Total Price:</div>
        </div>
        <div class="params-inputs">
          <input name="buy_input" type="number" v-model="amount">
          <div name="buy_price" class="input-text">{{ totalPrice }}</div>
        </div>
      </div>
      <div class="control-buttons">
        <CustomButton @click1="isBuyFormVisible = false">Cancel</CustomButton>
        <CustomButton name="buy_btn" :disabled="!isValidBuy" @click1="buy">Buy
        </CustomButton>
      </div>
    </div>
  </dialog>

  <dialog class="dialog sell-form" :open="isSellFormVisible">
    <div class="wrapper">
      <div class="dialog-header-text">Sell Stocks</div>
      <CustomButton name="sell_toggle_btn" class="switch-btn" @click1="() => {
        this.isBuyFormVisible = true;
        this.isSellFormVisible = false;
      }">Buy
      </CustomButton>
      <div class="params">
        <div class="params-names">
          <div class="params-text">Amount:</div>
          <div class="params-text">Total Price:</div>
        </div>
        <div class="params-inputs">
          <input name="sell_input" type="number" v-model="amount">
          <div name="sell_price" class="input-text">{{ totalPrice }}</div>
        </div>
      </div>
      <div class="control-buttons">
        <CustomButton @click1="isSellFormVisible = false">Cancel</CustomButton>
        <CustomButton name="sell_btn" :disabled="!isValidSell" @click1="sell">Sell</CustomButton>
      </div>
    </div>
  </dialog>
</template>
<script>
import HeaderComponent from "@/components/HeaderComponent";
import CustomButton from "@/components/CustomButton";
import IconButton from "@/components/IconButton";
import StockHistoryChart from "@/components/StockHistoryChart";
import axios from "axios";

export default {
  name: "ClientPage",
  components: {StockHistoryChart, IconButton, CustomButton, HeaderComponent},
  data() {
    return {
      brokerData: {
        full_name: this.$route.params.username,
        // TODO: Get data from server by username $route.params.username
        balance: 9000,
        stocks: [
          {
            code: "AAPL",
            amount: 4
          },
          {
            code: "SBUX",
            amount: 2
          }
        ]
      },
      availableStocksList: [
        {
          "name": "Apple, Inc.",
          "code": "AAPL"
        },
        {
          "name": "Starbucks, Inc.",
          "code": "SBUX"
        }
      ],


      chosenStockHistoryCode: "",


      // Form Data
      isValueChangeDialogVisible: false,
      isTradeHistoryDialogVisible: false,
      isBuyFormVisible: false,

      // Buy History
      isSellFormVisible: false,
      tradeCode: 0,
      stocksHistory: [
        {
          date: "9/10/2020",
          amount: 5,
          price: 9000,
          income: 0
        },
        {
          date: "9/11/2020",
          amount: -5,
          price: 9000,
          income: 0
        }
      ],

      // Buy/Sell
      code: "AAPL",
      amount: 0
    }
  },
  computed: {
    totalPrice() {
      let price = 0;

      for (const stock of this.$store._state.data.current_values) {
        if (stock.code === this.code) {
          price = stock.value;
          break;
        }
      }

      return this.amount * price;
    },
    isValidBuy() {
      if (this.amount <= 0) return false;

      if (this.amount % 1 !== 0) return false;

      return this.totalPrice <= this.brokerData.balance;
    },
    isValidSell() {
      if (this.amount <= 0) return false;

      if (this.amount % 1 !== 0) return false;

      return this.getBrokerStockAmount(this.code) >= this.amount;
    }
  },
  methods: {
    getBrokerStockAmount(stockCode) {
      for (const stock of this.brokerData.stocks) {
        if (stock.code === stockCode) {
          return stock.amount;
        }
      }
    },

    // TODO: update currentValues by websocket event
    getCurrentValue(stockCode) {
      for (const stock of this.$store._state.data.current_values) {
        if (stock.code === stockCode) {
          return stock.value;
        }
      }
    },

    incomeStyle(income) {
      return {
        green: income >= 0,
        red: income < 0
      }
    },

    prepareTradeHistory(code) {
      axios.post("http://localhost:3001/api/get_trade_history", {
        username: this.brokerData.full_name,
        code: code
      }).then((res) => {
        this.stocksHistory = res.data;
        this.isTradeHistoryDialogVisible = true;
      })

    },

    buy() {
      axios.post("http://localhost:3001/api/buy_stocks", {
        username: this.brokerData.full_name,
        code: this.code,
        amount: this.amount
      }).then(() => {
        this.isBuyFormVisible = false;
      })

    },

    sell() {
      axios.post("http://localhost:3001/api/sell_stocks", {
        username: this.brokerData.full_name,
        code: this.code,
        amount: this.amount
      }).then(() => {
        this.isSellFormVisible = false;
      })
    }
  },
  sockets: {
    async stopAfter() {
      const clientInfoResponse = await axios.post("http://localhost:3001/api/get_client_info", {
        username: this.$route.params.username
      });

      this.brokerData = {
        full_name: this.$route.params.username,
        balance: clientInfoResponse.data.cur_balance,
        stocks: clientInfoResponse.data.stocks
      }


      const curStocksListResponse = await axios.get("http://localhost:3200/api/get_chosen_stock_list_with_data");

      this.availableStocksList = curStocksListResponse.data;
    },
    stocks_update() {
      if (this.isTradeHistoryDialogVisible) {
        axios.post("http://localhost:3001/api/get_trade_history", {
          username: this.brokerData.full_name,
          code: this.tradeCode
        }).then((res) => {
          this.stocksHistory = res.data;
        })
      }
    },
    async user_traded_data(data) {

      let parsedData = JSON.parse(data);

      if (parsedData.username === this.brokerData.full_name) {
        for (const stock of this.brokerData.stocks) {
          if (stock.code === parsedData.stock_code) {
            stock.amount += parsedData.amount;
            break;
          }
        }

        this.brokerData.balance -= parsedData.amount * parsedData.price;
      }

      if (this.isTradeHistoryDialogVisible) {
        axios.post("http://localhost:3001/api/get_trade_history", {
          username: this.brokerData.full_name,
          code: this.tradeCode
        }).then((res) => {
          this.stocksHistory = res.data;
        })
      }

    },
    async stock_list_change() {
      const clientInfoResponse = await axios.post("http://localhost:3001/api/get_client_info", {
        username: this.$route.params.username
      });

      this.brokerData = {
        full_name: this.$route.params.username,
        balance: clientInfoResponse.data.cur_balance,
        stocks: clientInfoResponse.data.stocks
      }


      const curStocksListResponse = await axios.get("http://localhost:3200/api/get_chosen_stock_list_with_data");

      this.availableStocksList = curStocksListResponse.data;
    },
    user_list_change() {
      this.$router.push('/');
    }
  },
  async beforeMount() {
    const clientInfoResponse = await axios.post("http://localhost:3001/api/get_client_info", {
      username: this.$route.params.username
    });

    this.brokerData = {
      full_name: this.$route.params.username,
      balance: clientInfoResponse.data.cur_balance,
      stocks: clientInfoResponse.data.stocks
    }


    const curStocksListResponse = await axios.get("http://localhost:3200/api/get_chosen_stock_list_with_data");

    this.availableStocksList = curStocksListResponse.data;
  }
}
</script>

<style scoped lang="less">

.chart {
  height: 500px;
}

// Dialog

.value-change-history-dialog {
  height: fit-content;
}

.value-change-history-dialog .wrapper {
  height: auto;
  padding-bottom: 20px;
}

.wrapper {
  gap: 45px !important;
}

.input-text {
  border: 2px inset rgb(169, 158, 158);

  padding: 10px;

  border-radius: 10px;
  background: #dcdcdc;

  font-family: 'Roboto', serif;
  font-size: 27px;
  line-height: 32px;

  color: #001126;


}

.switch-btn {
  align-self: center;
}

.table-btns {
  gap: 10px;
}

.table-btn {
  width: 229px !important;
  height: 42px !important;

  .btn-text {
    font-size: 20px !important;
    line-height: 22px !important;
  }
}

.params-names {
  padding-top: 7px;
  gap: 51px;
}

.params-inputs {
  gap: 38px;
}

.control-buttons {
  gap: 85px;
}


// Table

th:nth-child(1) {
  width: 110px;
  text-align: center;
}

th:nth-child(2) {
  width: 155px;
  text-align: center;
}

th:nth-child(3) {
  width: 61px;
  text-align: left;
}

th:nth-child(4) {
  width: 727px;
  text-align: left;
}

td:nth-child(1) {
  text-align: center;
}

td:nth-child(2) {
  text-align: center;
}

td:nth-child(3) {
  text-align: left;
}

td {
  height: 55px;
}


.buy-history-dialog {
  th:nth-child(1) {
    width: 131px;
  }

  th:nth-child(2) {
    width: 100px;
    text-align: center;
  }

  th:nth-child(3) {
    width: 162px;
  }

  th:nth-child(4) {
    width: 162px;
  }

  td:nth-child(2) {
    text-align: center;
  }

  td {
    height: 49px;
  }

  tr:nth-child(odd) {
    &.buy {
      background: linear-gradient(0deg, rgba(115, 255, 120, 0.2), rgba(115, 255, 120, 0.2)), #F4F3E7;
    }

    &.sell {
      background: linear-gradient(0deg, rgba(255, 71, 71, 0.2), rgba(255, 71, 71, 0.2)), #D8D6CB;
    }
  }

  tr:nth-child(even) {
    &.buy {
      background: linear-gradient(0deg, rgba(115, 255, 120, 0.2), rgba(115, 255, 120, 0.2)), #F4F3E7;
    }

    &.sell {
      background: linear-gradient(0deg, rgba(255, 71, 71, 0.2), rgba(255, 71, 71, 0.2)), #F4F3E7;
    }
  }
}


.first-line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding-left: 35px;
  padding-right: 35px;
  padding-bottom: 22px;
}

.line-title {
  font-family: 'Comfortaa', serif;
  font-size: 32px;
  line-height: 36px;
}


.wrapper {
  justify-content: flex-start;

  gap: 30px;

  padding: 21px 30px 0;
}
</style>
