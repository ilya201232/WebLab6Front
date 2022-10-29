<template>
  <div class="header">
    <div class="left-header" @click="() => {
      $router.push('/');
    }">
      <span class="material-symbols-outlined header-icon"> attach_money </span>
      <div class="header-text">{{ title }}</div>
    </div>

    <CustomButton v-if="isIndex" class="header-btn" name="admin_btn" @click="() => {
      $router.push('/admin');
    }">Admin
    </CustomButton>

    <div v-if="isIndex" class="right-header">
      <select v-model="chosenUser" name="user_selector">
        <option v-for="(user, index) in usersList" :id="'user' + index" :value="user" :key="user">{{ user }}</option>
      </select>
      <CustomButton v-if="isIndex" class="header-btn" :disabled="chosenUser === ''" @click="() => {
        $router.push('/clients/' + chosenUser);
      }">Log In
      </CustomButton>
    </div>
    <div v-else class="right-header header-text">
      <div>Current Day:</div>
      <div name="date" v-if="!this.$store.state.is_working">--/--/----</div>
      <div name="date" v-else>{{ this.$store.state.current_date }}</div>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/CustomButton";
import axios from "axios";

export default {
  name: "HeaderComponent",
  components: {CustomButton},
  props: {
    title: String,
    isIndex: Boolean,
  },
  data() {
    return {
      // TODO: get these from server before render
      usersList: [
        "John", "Pop Top", "Top Gun"
      ],
      chosenUser: ""
    }
  },
  sockets: {
    user_list_change(data) {
      if (this.isIndex) {
        for (let i = 0; i < this.usersList; i++) {
          if (this.usersList[i] === data.prev_name) {
            this.usersList[i] = data.new_name;
          }
        }
      }

    }
  },
  async beforeMount() {
    if (this.isIndex) {
      const usersListResponse = await axios.get("http://localhost:3001/api/get_clients_names_list");
      this.usersList = usersListResponse.data;
    }
  }
}
</script>

<style scoped lang="less">

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  height: 63px;

  padding: 0 26px 0 65px;

  background: #E7E7E7;
  box-shadow: 0 2px 21px rgba(0, 0, 0, 0.25);

}

.left-header {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 22px;
}

.header-icon {
  font-size: 48px !important;
}

.header-text {
  font-size: 20px;
  line-height: 22px;
}

.right-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 48px;

  padding: 10px 35px 10px 35px;
}

.header-btn {
  width: 143px !important;
  height: 42px !important;
  background: #E7E7E7 !important;

  &:hover {
    background: #dadada !important;
  }

  &:active {
    background: #bbbbbb !important;
  }

  &:disabled {
    cursor: default;
    background: #d2d2d2 !important;
    border-color: #04254f;
  }

  &:disabled &:hover, &:active {
    background: #d2d2d2 !important;
  }
}

select {
  width: 273px;
  height: 44px;

  border-radius: 10px;

  font-family: 'Roboto', serif;
  font-style: normal;
  font-weight: 400;
  font-size: 27px;
  line-height: 32px;

  padding-left: 18px;

  &:last-child {
    border-radius: 10px;
  }
}


</style>
