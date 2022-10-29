<template>
  <HeaderComponent title="Exchange Client Admin"/>

  <div class="admin-page content-wrapper">
    <div class="first-line">
      <div class="line-title">Admin Page</div>
    </div>
    <div class="table">
      <table>
        <thead>
        <tr>
          <th>Full Name</th>
          <th>Current Money</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(broker, index) in brokersList" :key="broker.full_name">
          <td>{{ broker.full_name }}</td>
          <td>${{ broker.money }}</td>
          <td>
            <div :name="'stocks_btn' + index" class="table-btns">
              <CustomButton class="table-btn" @click="openBrokersStocksInfo(index)">Stocks Info</CustomButton>
            </div>

          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <dialog class="dialog stocks-info-dialog" :open="isDialogOpen">
    <IconButton icon_name="close" class="close-btn" @click="isDialogOpen = false"/>
    <div class="wrapper">
      <div class="dialog-header-text">Stocks Info</div>
      <div class="table">
        <table>
          <thead>
          <tr>
            <th>Stock Name</th>
            <th>Stock Code</th>
            <th>Amount</th>
            <th>Income</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(stock, index) in brokersList[chosenBrokerId].stocks" :key="stock.name">
            <td>{{ stock.name }}</td>
            <td>{{ stock.code }}</td>
            <td>{{ stock.amount }}</td>
            <td :name="'income' + index">
              <div class="green" v-if="stock.income >= 0">
                ${{ stock.income }}
              </div>
              <div class="red" v-else>
                -${{ Math.abs(stock.income) }}
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </dialog>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent";
import CustomButton from "@/components/CustomButton";
import IconButton from "@/components/IconButton";
import axios from "axios";

export default {
  name: "AdminPage",
  components: {IconButton, CustomButton, HeaderComponent},
  data() {
    return {
      // TODO: get these from server before render
      brokersList: [{
        stocks: []
      }],

      chosenBrokerId: 0,
      isDialogOpen: false
    }
  },
  methods: {
    incomeStyle(income) {
      return {
        green: income >= 0,
        red: income < 0
      }
    },
    openBrokersStocksInfo(brokerIndex) {
      this.chosenBrokerId = brokerIndex;
      this.isDialogOpen = true;
    }
  },
  sockets: {
    async stopAfter() {
      const clientsInfoResponse = await axios.get("http://localhost:3001/api/get_clients_info");

      this.brokersList = [];
      for (const broker of clientsInfoResponse.data) {
        this.brokersList.push({
          full_name: broker.full_name,
          money: broker.cur_balance,
          stocks: broker.stocks
        })
      }
    },
    async update() {
      const clientsInfoIncomeResponse = await axios.get("http://localhost:3001/api/get_clients_info_income");

      for (const client of clientsInfoIncomeResponse.data) {
        for (const broker of this.brokersList) {
          if (broker.full_name === client.full_name) {
            for (const stock of client.stocks) {
              for (const stockElement of broker.stocks) {
                if (stockElement.code === stock.code) {
                  stockElement.income = stock.income;
                }
              }
            }
          }
        }
      }
    },
    async user_traded_data(data) {
      const parsedData = JSON.parse(data);

      const clientsInfoResponse = await axios.get("http://localhost:3001/api/get_clients_info");

      let flag = false;

      for (const broker of clientsInfoResponse.data) {
        if (broker.full_name === parsedData.username) {
          for (const inner_broker of this.brokersList) {
            if (inner_broker.full_name === broker.full_name) {
              inner_broker.stocks = broker.stocks;
              inner_broker.money = broker.cur_balance;

              flag = true;
              break;
            }
          }

          if (flag) break;
        }
      }
    },
    async stock_list_change() {
      this.$router.push('/');
    },
    user_list_change() {
      this.$router.push('/');
    }
  },
  async beforeMount() {
    const clientsInfoResponse = await axios.get("http://localhost:3001/api/get_clients_info");

    this.brokersList = [];
    for (const broker of clientsInfoResponse.data) {
      this.brokersList.push({
        full_name: broker.full_name,
        money: broker.cur_balance,
        stocks: broker.stocks
      })
    }
  }
}
</script>

<style scoped lang="less">

.table-btn {
  width: 229px !important;
  height: 42px !important;

  .btn-text {
    font-size: 20px !important;
    line-height: 22px !important;
  }
}

th:nth-child(1) {
  width: 148px;
  text-align: left;
}

th:nth-child(2) {
  width: 158px;
  text-align: center;
}

th:nth-child(3) {
  width: 294px;
}

td:nth-child(2) {
  text-align: center;
}

td {
  height: 55px;
}


.stocks-info-dialog {
  th:nth-child(1) {
    width: 361px;
  }

  th:nth-child(2) {
    width: 180px;
    text-align: center;
  }

  th:nth-child(3) {
    width: 132px;
    text-align: left;
  }

  th:nth-child(4) {
    width: 327px;
    text-align: left;
  }

  td:nth-child(2) {
    text-align: center;
  }

  td {
    height: 49px;
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

  padding: 21px 30px 20px;

  height: calc(100% - 41px);
}

</style>
