const AWS = require('aws-sdk');

AWS.config.update({
  region: 'chennai', 
  endpoint: 'http://localhost:8000', 
  accessKeyId: '12345678', 
  secretAccessKey: '12345678',
});

const dynamoDBClient = new AWS.DynamoDB();

const params = {
  TableName: 'Expense_Table', 
  KeySchema: [
    { AttributeName: 'pk', KeyType: 'HASH' },
    {AttributeName : 'sk' ,KeyType : 'RANGE'}  //HASH / PARTITION    //RANGE / SORT    
  ],
  AttributeDefinitions: [
    { AttributeName: 'pk', AttributeType: 'S' }, 
    { AttributeName: 'sk', AttributeType: 'S' }
    
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10000, 
    WriteCapacityUnits: 10000, 
  },
};
dynamoDBClient.createTable(params, (err, data) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created successfully',data);
  }
});