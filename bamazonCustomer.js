var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    port : "3306",
    database : "bamazon",

});

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    printAll();
});

function printAll(){ 
    connection.query("SELECT * FROM products", function(error, response){
        for(var i = 0; i < response.length; i++){
            console.log("===================");
            console.log("#" + response[i].item_id + ": " + response[i].product_name);
            console.log("DEPARTMENT: " + response[i].department_name);
            console.log("PRICE: " + response[i].price);
            console.log("INVENTORY: " + response[i].stock_quantity);            
        }
        placeOrder();

    });

    

}

function placeOrder(){
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID number of the product you wish to purchase?",
            name : "itemId",
            validate: function (value){
                if(isNaN(value) === false){
                    return true;
                } else {
                    return false;
                }
            }
    }]).then(function(answer1){
            connection.query("SELECT * FROM products WHERE ?", {item_id : answer1.itemId}, function(err, res){
                if(err) throw err;
                // console.log(res);
                var currentProduct = res[0];
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Okay, the '" + currentProduct.product_name +  "' - how many would you like to purchase?",
                        name: "quantity",
                        validate: function (value){
                            if(isNaN(value) === false){
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
        
                ]).then(function(answer2){

                    if( answer2.quantity <= currentProduct.stock_quantity){
                        console.log("Order for '" + currentProduct.product_name + "' has been placed! We're sending " + answer2.quantity +  " your way!");
                        var updateQuantity = "UPDATE products SET ? WHERE ?";
                        connection.query(updateQuantity, [{stock_quantity : currentProduct.stock_quantity - answer2.quantity},{item_id : currentProduct.item_id}], function(err, res){
                            if(err) throw err;
                                inquirer.prompt([
                                    {
                                        type : "list",
                                        message : "Place another order?",
                                        name : "newOrder",
                                        choices : ["Yes" , "No"]
                                    }
                                ]).then(function(answer3){
                                    if(answer3.newOrder === "Yes"){
                                        printAll();
                                    } else {
                                        connection.end();
                                    }
                                });
                        });
                    } else {
                        console.log("We can't accomodate that amout. Unfortunately, we only have " + currentProduct.stock_quantity + " left...");
                    }
                });
        });

    });
   

}