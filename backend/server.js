const express = require("express");
const cors = require("cors");
const app = express();
const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json());
app.use(cors()); 

const port = 4000
const tables = {
  ExpenseTable: process.env.EXPENSE_TABLE,
};

AWS.config.update({
  region: "chennai",
  endpoint: "http://localhost:8000",
  accessKeyId: "12345678",
  secretAccessKey: "12345678",
});

const dynamoDBClient = new AWS.DynamoDB.DocumentClient();

app.post("/api/expense", async (req, res) => {
  try {
    let setCategory = req.body.category;
    let setAmount = req.body.amount;
    let setDate = req.body.date;
    let setDescription = req.body.description;
    let setTime = req.body.time;

    const params = {
      TableName: tables.ExpenseTable,
      Item: {
        pk: 'All',
        sk: setCategory + '#' + setTime,
        amount :setAmount,
        date: setDate,
        description : setDescription,
      },
    };
    dynamoDBClient.put(params, (error, data) => {
      if (error) {
        res.send("error in inserting");
      } else {
        res.send("data inserted in db sucessfully ");
      }
    });
  } catch (error) {
    res.send(error.data);
  }
});

app.get("/api/expense", async (req, res) => {
  try {
       var params = {
         TableName: tables.ExpenseTable,
         KeyConditionExpression: 'pk = :pk',
         ExpressionAttributeValues: {
          ':pk': 'All',
        },
    };
    dynamoDBClient.query(params, (error, data) => {
      if (error) {
        console.log("Error in fetching data:", error);
        res.status(500).send(error.message);
      } else {
        console.log(data.Items);
        res.status(200).send(data.Items);
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error.message);
  }
});
app.get("/api/expense/:category/:time", async (req, res) => {
  try {
    const cate= req.params.category
    const time= req.params.time
    const params = {
      TableName: tables.ExpenseTable,
      KeyConditionExpression: 'pk = :pk and sk = :sk',
      ExpressionAttributeValues: {
        ':pk': 'All',
        ':sk': cate +'#' + time
      },
    };
    dynamoDBClient.query(params, (error, data) => {
      if (error) {
        console.log("Error in fetching data:", error);
        res.status(500).send(error.message);
      } else {
        console.log("respone",data.Items)
        res.status(200).send(data.Items);
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error.message);
  }
});
app.delete("/api/expense/:category/:time", async (req, res) => {
  try {
    const cate = req.params.category;
    const time = req.params.time;
    const params = {
      TableName: tables.ExpenseTable,
      Key: {
        'pk': 'All',
        'sk': cate + '#' +time
      },
    };
    dynamoDBClient.delete(params, (error, data) => {
      if (error) {
        console.log("Error in deleting record:", error);
        res.status(500).send(error.message);
      } else {
        console.log("Record deleted successfully");
        res.status(200).send("Record deleted successfully");
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error.message);
  }
});
app.put("/api/expense", async (req, res) => {
  try {
    const cate = req.body.category;
    const time=req.body.time
    const setAmount = req.body.amount
    const setDate = req.body.date;
    const setDescription = req.body.description;
    const params = {
      TableName: tables.ExpenseTable,
      Key: {
        'pk': 'All',
        'sk': cate + '#' + time
      },
      UpdateExpression: 'SET #amount = :amount ,#date = :dateVal, #description = :descriptionVal',
      ExpressionAttributeNames: {
        '#amount': 'amount',
        '#date': 'date',
        '#description' : 'description'
      },
      ExpressionAttributeValues: {
        ':amount':setAmount,
        ':dateVal':setDate,
        ':descriptionVal':setDescription
      },
      ReturnValues: 'ALL_NEW'
    };

    dynamoDBClient.update(params, (error, data) => {
      if (error) {
        console.log("Error in updating record:", error);
        res.status(500).send(error.message);
      } else {
        console.log("Record updated successfully");
        res.status(200).send("Record Updated Successfully");
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error.message);
  }
});

app.listen(port , (error)=>{
  if(error){
    console.log("error in running the server" , error)
  }else{
    console.log("server is running in the port :" ,port)
  }
})