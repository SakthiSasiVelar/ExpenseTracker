<template>
  <div class="head">
    <h1>Expense Tracker</h1>
  </div>
  <div class="input">
    <div class="input-section">
      <form @submit.prevent="submitForm">
        <table class="inp-container">
          <tbody>
            <tr class="table-tr">
              <td><label>Category :</label></td>
              <td>
                <select  v-model="this.category" id="drop-down">
                  <option  disabled selected value="">CHOOSE</option>
                  <option >FOOD</option>
                  <option >ENTERTAINMENT</option>
                  <option >MEDICAL</option>
                  <option >MISCELLANEOUS</option>
                </select>
              </td>
            </tr>
            <tr class="table-tr">
              <td><label>Amount :</label></td>
              <td>
                <input
                  v-model="this.amount"
                  type="number"
                  id="amount"
                  required="true"
                />
              </td>
            </tr>
            <tr class="table-tr">
              <td><label>Date :</label></td>
              <td>
                <input v-model="this.date" type="date" required="true" />
              </td>
            </tr>
            <tr class="table-tr">
              <td><label>Description :</label></td>
              <td>
                <textarea
                  v-model="this.description"
                  type="text"
                  required="true"
                  id="description"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="button">
          <button v-if="!isUpdate" type="submit" id="btn">Add</button>
          <button v-else type="submit" id="btn">Update</button>
        </div>
      </form>
    </div>
  </div>
  
  <div class="output">
    <table class="output-container">
      <tbody>
        <tr id="header">
          <th>Category</th>
          <th>Amount</th>
          <th>Date</th>
          <th colspan="2">Description</th>
          <th>Update</th>
          <th>Delete</th>
        </tr>
        <tr v-if="noExpense" id="footer1">
          <td colspan="6">No expenses!</td>
        </tr>
        <tr v-else class="list" :key="ind" v-for="(list, ind) in lists">
          <td>{{ list.category }}</td>
          <td>{{ list.amount }}</td>
          <td>{{ list.date }}</td>
          <td colspan="2">{{ list.description }}</td>
          <td>
            <button @click="upData(ind)" class="t-btn">update</button>
          </td>
          <td>
            <button @click="delData(ind)" class="t-btn">delete</button>
          </td>
        </tr>
        <tr v-if="!noExpense" id="footer2">
          <td>Total</td>
          <td>{{ totalExpense }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      totalExpense: 0,
      isUpdate: false,
      lists: [],
      category: "",
      amount: "",
      description: "",
      date: "",
      time: "",
    };
  },
  computed: {
    noExpense() {
      return this.lists.length == 0;
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    submitForm() {
      if (this.isUpdate === true) {
        this.updateData();
      } else {
        this.addData();
      }
    },
    getInput() {
      let input = {
        category: this.category,
        amount: this.amount,
        date: this.date,
        description: this.description,
        time: new Date(),
      };
      return input;
    },
    getUpdateInput() {
      let upDateinput = {
        category: this.category,
        amount: this.amount,
        date: this.date,
        description: this.description,
        time: this.time,
      };
      return upDateinput;
    },
    clearForm() {
      this.category = "";
      this.amount = "";
      this.reason = "";
      this.date = "";
      this.description = "";
    },
    addData() {
      let getExpense = this.getInput();
      axios
        .post("http://localhost:4000/api/expense", getExpense)
        .then((response) => {
          alert(response.data);
          this.lists = [], 
          this.fetchData();
        })
        .catch((error) => {
          console.log(error);
        });
      this.clearForm();
    },
    fetchData() {
      axios
        .get("http://localhost:4000/api/expense")
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            let tempArr = response.data[i].sk.split("#");
            let obj = {
              amount: response.data[i].amount,
              category: tempArr[0],
              date: response.data[i].date,
              description: response.data[i].description,
              time: tempArr[1],
            };
            this.lists.unshift(obj);
          }
          this.totalExpense = 0;
          for (let i = 0; i < this.lists.length; i++) {
            this.totalExpense = this.totalExpense + this.lists[i].amount;
          }
        })
        .catch((error) => {
          console.log(error.data);
        });
    },
    delData(ind) {
      axios
        .delete(
          `http://localhost:4000/api/expense/${this.lists[ind].category}/${this.lists[ind].time}`
        )
        .then((response) => {
          alert(response.data);
          this.lists = [];
          this.fetchData();
        })
        .catch((error) => {
          console.error(error.data);
        });
    },
    upData(ind) {
      this.isUpdate = true;
      axios
        .get(
          `http://localhost:4000/api/expense/${this.lists[ind].category}/${this.lists[ind].time}`
        )
        .then((response) => {
          if (response.data.length === 0) {
            alert("data not found!");
            this.lists = [];
            this.fetchData();
            this.isUpdate = false;
          } else {
            let temp = response.data[0].sk.split("#");
            this.category = temp[0];
            this.time = temp[1];
            this.description = response.data[0].description;
            this.amount = response.data[0].amount;
            this.date = response.data[0].date;
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
    updateData() {
      let getUpdateExpense = this.getUpdateInput();
      axios
        .put("http://localhost:4000/api/expense", getUpdateExpense)
        .then((response) => {
          alert(response.data);
          this.lists = [];
          this.fetchData();
        })
        .catch((error) => {
          console.log(error.data);
        });
      this.clearForm();
      this.isUpdate = false;
    },
  },
};
</script>

<style>
.head,
.input {
  font-family: Arial, sans-serif;
}
.head h1 {
  text-align: center;
}
.input-section {
  padding: 20px;
}

.inp-container {
  white-space: nowrap;
  margin: auto;
}
.input-section label {
  font-weight: bold;
}
.input-section input {
  padding: 5px;
}
.input-section #drop-down {
  padding: 8px;
}
.table-tr {
  padding-bottom: 30px;
}
#description {
  padding: 10px;
}
.button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
#btn {
  background-color: rgba(8, 211, 8, 0.838);
  width: 100px;
  padding: 10px;
  border: none;
  border-radius: 5px;
}
.output-container {
  width: min(1000px, 90%);
  margin: auto;
  border-collapse: collapse;
  border: 2px solid grey;
  font-family: sans-serif;
}
.output-container th,
.list td {
  border: 1px solid grey;
  padding: 5px 10px;
}
.output-container td {
  text-align: center;
}
#header {
  background-color: aquamarine;
}
.output-container th {
  padding-bottom: 8px;
  padding-top: 8px;
}
.t-btn {
  background-color: rgba(8, 211, 8, 0.838);
  border: none;
  border-radius: 3px;
  width: 70px;
  padding: 7px;
}
#footer2,
#footer1 {
  font-size: large;
  font-weight: bold;
  font-family: Arial, sans-serif;
}
#footer2 td,
#footer1 td {
  padding: 10px;
  text-align: center;
}

</style>
