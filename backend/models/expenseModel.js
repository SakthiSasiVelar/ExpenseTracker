const mongoose=require('mongoose')

const ExpenseSchema = mongoose.Schema(
    {
        reason :{
            type : String,
            required : true
        },
        amount :{
            type : Number,
            required : true
        },
        date :{
            type : String,
            required : true
        }
    }
)

const Expense = mongoose.model('Expense' , ExpenseSchema)

module.exports = Expense