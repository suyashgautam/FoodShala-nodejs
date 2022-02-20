var mysql = require('mysql')
const bcyrpt = require('bcrypt');
const uuid = require('uuid');

var connection = mysql.createConnection({
    host: 'localhost',
    user : 'root',
    password: '',
    database: 'foodshala_db'
});

connection.connect();

const getAllDishes = (callback) => {
    try {
        connection.query(`SELECT dishes_tb.d_id,
        dishes_tb.rest_id,
        dishes_tb.d_name,
        dishes_tb.d_cost,
        dishes_tb.d_type,
        dishes_tb.d_image,
        restaurantlogin_tb.r_name
        FROM dishes_tb
        LEFT JOIN restaurantlogin_tb
        ON dishes_tb.rest_id = restaurantlogin_tb.rest_id`, (error, results, fields) => {
            if(error) {
                callback(error)
            }
            callback(results);
        })
    }
    catch(e) {
        callback(e);
    }
}

const getAllRestaurants = (callback) => {
    try {
        connection.query('SELECT rest_id, r_image, r_name, r_address from restaurantlogin_tb', (error, results, fields) => {
            if(error) {
                callback(error)
            }
            callback(results);
        })
    }
    catch(e) {
        callback(e);
    }
}

const addCustomer = (data, callback) => {
    try {
        const sql = `INSERT INTO customerlogin_tb(\`c_name\`, \`c_phone\`, \`c_preference\`, \`c_address\`, \`c_email\`, \`c_password\`, \`c_image\`) VALUES('${data.name}', '${data.phone}', '${data.preference}', '${data.address}', '${data.email}', '${data.password}', '${data.image}')`;
        connection.query(sql, (error, results, fields) => {
            if(error) {
                callback(error)
            }
            callback(results);
        })
    }
    catch(e){
        callback(e);
    }
}
const addRestaurant = (data, callback) => {
    try {
        const sql = `INSERT INTO restaurantlogin_tb(\`r_name\`, \`r_address\`, \`r_email\`, \`r_password\`, \`r_image\`) VALUES('${data.name}', '${data.address}', '${data.email}', '${data.password}', '${data.image}')`;
        connection.query(sql, (error, results, fields) => {
            if(error) {
                callback(error)
            }
            callback(results);
        })
    }
    catch(e){
        callback(e);
    }
}

const getUserDetails = (username, flag, callback) => {
    try{
        if(flag === "customer"){
            const sql = `SELECT c_id, c_email, c_password, c_name, c_image, c_address, c_phone FROM customerlogin_tb WHERE c_email = '${username}' limit 1`
            connection.query(sql, (error, results, fields) => {
                if(error) {
                    callback(error)
                }
                if(results.length === 0)
                {
                    return callback(null);
                }
                else
                {
                    callback({id: results[0].c_id, name: results[0].c_name, email: results[0].c_email, password: results[0].c_password, image: results[0].c_image, type: "customer", address: results[0].c_address, phone: results[0].c_phone});
                }
            })
        }
        else
        {
            const sql = `SELECT rest_id, r_email, r_password, r_name, r_image, r_address FROM restaurantlogin_tb WHERE r_email = '${username}' limit 1`
            connection.query(sql, (error, results, fields) => {
                if(error) {
                    callback(error)
                }
                if(results.length === 0)
                {
                    return callback(null);
                }
                return callback({id: results[0].rest_id, name: results[0].r_name, email: results[0].r_email, password: results[0].r_password, image: results[0].r_image, address: results[0].r_address , type: "restaurant"});
            })
        }
    }
    catch(e){
        callback(e);
    }
}

const updatePassword = (data, callback) => {
    if(data.type == 'restaurant')
    {
        const sql = `SELECT r_password from restaurantlogin_tb where r_email = '${data.email}'`;
        connection.query(sql, (err, results, fields) => {
            if(bcyrpt.compareSync(data.opassword, results[0].r_password))
            {
                const sql = `UPDATE restaurantlogin_tb SET r_password = '${data.npassword}' WHERE r_email = '${data.email}'`;
                connection.query(sql, (error, results, fields) => {
                    if(error) {
                        callback({message: "failure"})
                    }
                    if(results.changedRows > 0)
                    {
                        callback({message: "success"});
                    }
                    else
                    {
                        callback({message: "failure"});
                    }
                })
            }
            else
            {
                callback({message: "failure"});
            }
        })
    }
    else
    {
        const sql = `SELECT c_password from customerlogin_tb where c_email = '${data.email}'`;
        connection.query(sql, (err, results, fields) => {
            if(bcyrpt.compareSync(data.opassword, results[0].c_password))
            {
                const sql = `UPDATE customerlogin_tb SET c_password = '${data.npassword}' WHERE c_email = '${data.email}'`;
                connection.query(sql, (error, results, fields) => {
                    if(error) {
                        callback(error)
                    }
                    if(results !== undefined && results.changedRows > 0)
                    {
                        callback({message: "success"});
                    }
                    else
                    {
                        callback({message: "failure"});
                    }
                })
            }
            else
            {
                callback({message: "failure"});
            }
        })
    }
}

const allDishes = (r_id, callback) => {
    const sql = `SELECT * FROM dishes_tb WHERE rest_id = '${r_id}'`
    connection.query(sql, (err, results, fields) => {
        if(err){
            callback(err);
        }
        var dishes = []
        results.forEach(element => {
            dishes.push({
                d_id: element.d_id,
                rest_id: element.rest_id,
                name: element.d_name,
                cost: element.d_cost,
                type: element.d_type,
                image: element.d_image,
            })
        });
        callback(dishes);
    })
}

const getDish = (d_id, callback) => {
    const sql = `SELECT * FROM dishes_tb WHERE d_id = ${d_id}`;
    connection.query(sql, (err, results, fields) => {
        if(err){
            return callback(err)
        }
        callback({d_id: results[0].d_id, d_name: results[0].d_name, d_cost: results[0].d_cost, d_type: results[0].d_type, d_image: results[0].d_image});
    })
}

const addDish = (data, callback) => {
    if(data.d_image !== '')
    {
        sql = `INSERT INTO dishes_tb(rest_id, d_name, d_cost, d_type, d_image) VALUES 
        ('${data.rest_id}','${data.d_name}','${data.d_cost}','${data.d_type}','${data.d_image}')`;
    }
    else
    {
        sql = `INSERT INTO dishes_tb(rest_id, d_name, d_cost, d_type) VALUES 
        ('${data.rest_id}','${data.d_name}','${data.d_cost}','${data.d_type}')`;
    }
    connection.query(sql, (err, results, fields) => {
        if(err){
            callback({message: false});
        }
        callback({message: true});
    })
}

const updateDish = (data, callback) => {
    if(data.d_image !== '')
    {
        sql = `UPDATE dishes_tb SET d_name = '${data.d_name}', d_cost = '${data.d_cost}', d_type = '${data.d_type}', d_image = '${data.d_image}' WHERE d_id = ${data.d_id}`;
    }
    else
    {
        sql = `UPDATE dishes_tb SET d_name = '${data.d_name}', d_cost = '${data.d_cost}', d_type = '${data.d_type}' WHERE d_id = ${data.d_id}`;
    }
    connection.query(sql, (err, results, fields) => {
        if(err){
            callback(err);
        }
        callback({message: true});
    })
}

const deleteDish = (data, callback) => {
    const sql = `DELETE FROM dishes_tb WHERE d_id = ${data}`;
    connection.query(sql, (err, results, fields) => {
        if(err){
            return callback({message: false});
        }
        callback({message: true});
    })
}

const updateProfile = (data, flag, callback) => {
    if(flag === "customer"){
        if(data.c_image !== '')
        {
            sql = `UPDATE customerlogin_tb SET c_name = '${data.c_name}', c_address = '${data.c_address}', c_phone = '${data.c_phone}', c_image = '${data.c_image}' WHERE c_email = '${data.c_email}'`;
        }
        else
        {
            sql = `UPDATE customerlogin_tb SET c_name = '${data.c_name}', c_address = '${data.c_address}', c_phone = '${data.c_phone}' WHERE c_email = '${data.c_email}'`;
        }
    }
    else
    {
        if(data.r_image !== '')
        {
            sql = `UPDATE restaurantlogin_tb SET r_name = '${data.r_name}', r_address = '${data.r_address}', r_image = '${data.r_image}' WHERE r_email = '${data.r_email}'`;
        }
        else
        {
            sql = `UPDATE restaurantlogin_tb SET r_name = '${data.r_name}', r_address = '${data.r_address}' WHERE r_email = '${data.r_email}'`;
        }
    }
    connection.query(sql, (err, results, fields) => {
        if(err){
            callback(err);
        }
        callback({message: true});
    })
}

const addToCartDB = (data, callback) => {
    const sql = `INSERT IGNORE INTO cart_tb(r_id, d_id, c_email, d_cost, d_name) VALUES ('${data.rest_id}', '${data.d_id}', '${data.c_email}', '${data.d_cost}', '${data.d_name}')`;
    connection.query(sql, (err, results, fields) => {
        if(err){
            callback({message: "Failure"});
        }
        console.log(results);
        if(results && results.affectedRows > 0)
        {
            callback({message: "Success"});
        }
        else
        {
            callback({message: "Present"});
        }
    })
}

const getCartDishes = (c_email, callback) => {
    const sql = `SELECT * FROM cart_tb WHERE c_email = '${c_email}'`;
    connection.query(sql, (err, results, fields) => {
        if(err) {
            callback({message: "Failure"});
        }
        callback(results);
    })
}

const updateCartQty = (data, callback) => {
    const sql = `UPDATE cart_tb SET cart_quantity = '${data.qty}' WHERE c_email = '${data.c_email}' and d_id = '${data.d_id}'`;
    connection.query(sql, (err, results, fields) => {
        if(err){
            callback({message: "Failure"});
        }
        callback({message: "Success"});
    })
}

const deleteFromCart = (data, callback) => {
    const sql = `DELETE FROM cart_tb WHERE c_email = '${data.email}' and d_id = '${data.d_id}'`;
    connection.query(sql, (err, results, fields) => {
        if(err){
            callback({message: "Failure"});
        }
        else
        {
            callback({message: "Success"});
        }
    })
}

const getAllOrders = (data, flag, callback) => {
    if(flag === 'restaurant')
    {
        const sql = `SELECT * FROM order_tb WHERE r_id = '${data}' ORDER BY o_datetime`;
        connection.query(sql, (err, results, fields) => {
            if(err){
                return callback({message: 'Failure'});
            }
            return callback(results);
        })
    }
    else
    {
        const sql = `SELECT * FROM order_tb WHERE c_email = '${data}' ORDER BY o_datetime`;
        connection.query(sql, (err, results, fields) => {
            if(err) {
                return callback({message: 'Failure'});
            }
            return callback(results);
        })
    }

}

const addOrder = (email, callback) => {
    const sql = `SELECT * FROM cart_tb where c_email = '${email}'`;
    connection.query(sql, (err, results, fields) => {
        if(err) {
            return callback({message: "Failed"});
        }
        else
        {
            const oid = uuid.v1();
            results.forEach((element, index) => {
                console.log(element);
                const payment = element.cart_quantity * element.d_cost;
                const osql = `INSERT INTO order_tb(o_id, d_id, d_quantity, r_id, o_status, o_payment, c_email) VALUES 
                ('${oid}', '${element.d_id}', '${element.cart_quantity}', '${element.r_id}', 'In Progress', '${payment}', '${element.c_email}')`;
                connection.query(osql, (err, results, fields) => {
                    if(err){
                        return callback({message: 'Failed'});
                    }
                })
            })
        }
        return callback({message: 'Success'});
    })
}

const removeCart = (email, callback) => {
    const sql = `DELETE FROM cart_tb WHERE c_email = '${email}'`;
    connection.query(sql, (err, results, fields) => {
        if(err){
            return callback({message: 'Failed'});
        }
        callback({message: 'Success'});
    })
}

module.exports = {getAllDishes, getAllRestaurants, addCustomer, addRestaurant, getUserDetails, 
    updatePassword, updateProfile, allDishes, addDish, updateDish, deleteDish, getDish, addToCartDB, 
    getCartDishes, updateCartQty, deleteFromCart, addOrder, removeCart, getAllOrders};