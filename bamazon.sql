DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;
CREATE TABLE products(
-- item_id (unique id for each product)
item_id INT(10) NOT NULL AUTO_INCREMENT,
-- product_name (Name of product)
product_name VARCHAR(50) NOT NULL, 
-- department_name
department_name VARCHAR(50) NOT NULL,
-- price (cost to customer)
price DECIMAL(10,2) NOT NULL,
-- stock_quantity (how much of the product is available in stores)
stock_quantity INT,
PRIMARY KEY (item_id)

);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("wooden chair","furniture", 45, 100);

SELECT * FROM products

