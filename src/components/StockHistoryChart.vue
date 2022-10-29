<template>
  <Line
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
  />
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js'
import axios from "axios";

const maxNodes = 50;

ChartJS.register(Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale)

export default {
  name: "StockHistoryChart",
  components: {Line},
  props: {
    stockCode: {
      type: String
    },
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {
      }
    },
    plugins: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      chartData: {
        labels: ["9/10/2020", "9/11/2020", "9/12/2020"],
        datasets: [{
          label: 'Stock Price',
          data: [4.53, 4.24, 4.39],
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          pointRadius: 10,
          pointHoverRadius: 15
        },]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 0.2
      },
      rawHistory: [],
    }
  },
  sockets: {
    async update() {
      if (this.stockCode === "") return;

      const history = (await axios.post("http://localhost:3001/api/get_simulation_stock_history", {
        code: this.stockCode
      })).data;

      if (history === "") {
        this.chartData.labels = ["Null"];
        this.chartData.datasets[0].data = [0];

        return;
      }

      let rawHistory = history.reverse();

      let labels = [];
      let data = [];

      if (this.rawHistory.length >= maxNodes) {
        for (let i = 0; i < rawHistory.length; i+= Math.round(rawHistory.length / maxNodes + 1)) {
          labels.push(rawHistory[i].date);
          data.push(rawHistory[i].value);
        }
      } else {
        for (let i = 0; i < rawHistory.length; i++) {
          labels.push(rawHistory[i].date);
          data.push(rawHistory[i].value);
        }
      }

      if (!labels.includes(rawHistory[rawHistory.length - 1].date)) {
        data.push(rawHistory[rawHistory.length - 1].value)
        labels.push(rawHistory[rawHistory.length - 1].date)
      }

      this.chartData.labels = labels;
      this.chartData.datasets[0].data = data;
    },
  },
  async beforeUpdate() {
    if (this.stockCode === "") return;

    console.log("Before Update: " + this.stockCode);

    const history = (await axios.post("http://localhost:3001/api/get_simulation_stock_history", {
      code: this.stockCode
    })).data;

    if (history === "") {
      this.chartData.labels = ["Null"];
      this.chartData.datasets[0].data = [0];

      return;
    }

    this.rawHistory = history.reverse();

    console.log(this.rawHistory);

    let labels = [];
    let data = [];

    if (this.rawHistory.length >= maxNodes) {
      for (let i = 0; i < this.rawHistory.length; i+= Math.round(this.rawHistory.length / maxNodes + 1)) {
        labels.push(this.rawHistory[i].date);
        data.push(this.rawHistory[i].value);
      }
    } else {
      for (let i = 0; i < this.rawHistory.length; i++) {
        labels.push(this.rawHistory[i].date);
        data.push(this.rawHistory[i].value);
      }
    }

    if (!labels.includes(this.rawHistory[this.rawHistory.length - 1].date)) {
      data.push(this.rawHistory[this.rawHistory.length - 1].value)
      labels.push(this.rawHistory[this.rawHistory.length - 1].date)
    }

    this.chartData.labels = labels;
    this.chartData.datasets[0].data = data;

  }
}
</script>

<style scoped>

</style>
