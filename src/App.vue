<template>
  <router-view/>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style lang="less">

.green {
  color: #038600;
}

.red {
  color: #EB1717;
}


.content-wrapper {
  padding: 42px 70px 0 70px;
}

body {
  margin: 0;

  font-family: 'Comfortaa', serif;
  font-style: normal;
  font-weight: 400;
}

/*############# TABLE ################*/

.table {
  font-family: 'Roboto', serif;
  font-size: 20px;
  line-height: 21px;

  overflow-x: auto;
}

table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}

th {
  padding: 10px;

  font-weight: normal;

  color: #EEEEEE;
  background-color: #68655B;
}

td {
  padding: 10px;

  width: 41px;

  /*  Height must be set manually in the end implementation  */

  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/*  Setting text-align to center/left/right must done manually in the end implementation */
/*  Setting columns sizes must done manually in the end implementation */

tr:nth-child(odd) {
  background: #D8D6CB;

  button {
    background: #D8D6CB !important;

    &:hover {
      background: #c7c5bb !important;
    }

    &:active {
      background: #b7b5ab !important;
    }

    &:disabled {
      background: #a6a59b !important;
    }

    &:disabled &:hover, &:active {
      background: #a6a59b !important;
    }
  }
}

tr:nth-child(even) {
  background: #F4F3E7;

  button {
    background: #F4F3E7 !important;

    &:hover {
      background: #e3e2d7 !important;
    }

    &:active {
      background: #d2d1c7 !important;
    }

    &:disabled {
      background: #bdbcb3 !important;
    }

    &:disabled &:hover, &:active {
      background: #bdbcb3 !important;
    }
  }
}

.table-btns {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  /*  Gap must be set manually in the end implementation  */
}

/*############# DIALOG ################*/

.dialog {
  box-sizing: border-box;

  position: absolute;
  width: 90vw;
  min-width: 700px;
  height: 517px;
  top: 132px;

  background: #FFFFFF;
  border: 1px solid #000000;
  border-radius: 50px;

  padding: 0;

  .wrapper {
    height: 100%;
    border-radius: 50px;

    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .params {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 66px;

      padding: 0 35px 0 68px;
    }
  }
}

.dialog-header-text {
  text-align: center;

  font-family: 'Inter', serif;
  font-style: normal;
  font-weight: 400;
  font-size: 40px;
  line-height: 48px;
}

.params {
  .params-names {
    display: flex;
    flex-direction: column;

    min-width: 180px;

    /*  Gap must be set manually in the end implementation  */
  }

  .params-inputs {
    flex: 1;
    display: flex;
    flex-direction: column;
    /*  Gap must be set manually in the end implementation  */
  }
}

.params-text {
  font-family: 'Roboto', serif;
  font-size: 32px;
  line-height: 130%;
  /* or 42px */

  text-align: right;
}

input {
  padding: 10px;
  gap: 10px;

  height: calc(59px - 20px - 4px);

  border-radius: 10px;
  background: #FAFAFA;

  font-family: 'Roboto', serif;
  font-size: 27px;
  line-height: 32px;

  color: #001126;
}

.control-buttons {
  align-self: center;

  display: flex;
  flex-direction: row;
  /*  Gap must be set manually in the end implementation  */

  .btn {
    height: 49px;

    .btn-text {
      font-size: 20px;
      line-height: 22px;
    }
  }
}

.border-btn {
  border: 2px solid #05336E !important;
}

.close-btn {

  position: absolute;

  right: 30px;
  top: 20px;

  width: 48px;
  height: 48px;

  .icon {
    font-size: 48px;
  }
}


</style>
