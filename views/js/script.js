var dishes = document.querySelectorAll(".inddishes");
var showDishes = document.querySelector(".allDishes");
var All = document.querySelector('.All');
var allRestaurants = document.querySelector('.restaurants');

window.addEventListener('load', (e) => {
    async function getData(url) {
        const response = await fetch(url)
        return response.json();
    }

    getData('/getallrestaurants').then(getAllRestaurants => {
        var allr = "";
        var totalRest = getAllRestaurants.length - 1;
        getAllRestaurants.forEach((rest, ind) => {
            const leftarr = `<section id='section${(ind/5) + 1}'>
            <a href='#section${((ind/5) + 1) == 1 ? 1 : (ind/5)}' class='arrow__btn'>‹</a>`;
            const rightarr = `<a href='#section${Math.floor(ind/5) + 2}' class='arrow__btn'>›</a>
            </section>`
            const newr = `<div class="item card">
            <!-- <div style="border-radius:10px;" class="card"> -->
            <img src="${(rest.r_image != "") ? (rest.r_image) : "./image-not-available.jpg"}" alt="" class="card-img-top" height="250" width="300">
            <div class="card-body text-center">
                <h5 class="card-title"><strong>${rest.r_name}</strong></h5>
                <p class="card-text">Address: ${rest.r_address}</p>
                <form method="POST" onsubmit="event.preventDefault(); findDishes(${rest.rest_id})">
                    <button type="submit" name="All_Dishes" class="btn btn-default">All Dishes</button>
                    <input type="hidden" name="rest_id" id="${rest.rest_id}" value="${rest.rest_id}">
                </form>
            </div>
        </div>`
            if(ind % 5 == 0)
            {
                allr = allr + leftarr + newr;
            }
            else
            {
                if(ind % 5 == 4)
                {
                    allr = allr + newr + rightarr;
                }
                else
                {
                    allr = allr + newr;
                }
            }
        })

        while(totalRest % 5 != 4)
        {
            const newr = `<div class='item card'>
            <img src='./cs.jpg' alt='' class='card-img-top' height='250' width='100'>
            <div class='card-body text-center'>
                <h5 class='card-title'>Coming Soon</h5>
                <p class='card-text'>Address: </p>
                    <button type='submit' name='#' class='btn btn-default'>All Dishes</button>
                    <input type='hidden' name='rest_id' value=''>
                </div>
            </div>`
            allr = allr + newr;
            totalRest += 1;
        }
        const rightarr = `<a href='#section1' class='arrow__btn'>›</a></section>`;
        allr = allr + rightarr;
        allRestaurants.innerHTML = allr;

        getData('/getalldishes').then(getAllDishes => {
            var alld = "";
            
            getAllDishes.forEach(dish => {
                const newd = `<div class="col-lg-3 mb-5 inddishes" id = "${dish.d_type + ' ' + dish.rest_id}">
                <div class="card">
                    <img src="${(dish.d_image == "")?"./image-not-available.jpg":dish.d_image}" height="150" width="100%" alt="" class="card-img-top">
                        <div class="card-body text-center">
                            <h5 class="card-title"><strong>${dish.d_name}</strong></h5>
                            <p class="card-text"><strong><em>Price:</em></strong> Rs. ${dish.d_cost}</p>
                            <p class="card-text"><strong><em>Type: </em></strong>${dish.d_type}</p>
                            <p class="card-text"><strong><em>Restaurant:</em></strong> ${dish.r_name}</p>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                            <button onclick = "addToCart('${dish.d_id}', '${dish.d_name}', '${dish.d_cost}', '${dish.rest_id}')" name="Add_To_Cart" class="btn btn-info">Add to Cart</button>
                        </div>
                    </div>
                </div>`;
                alld = alld + newd;
            })
            showDishes.innerHTML = alld;
            dishes = document.querySelectorAll(".inddishes");
            showDishes = document.querySelector(".allDishes");
            All = document.querySelector('.All');
        })
    })
});

const addToCart = (d_id, d_name, d_cost, rest_id) => {
    const data = {
        d_id,
        d_name,
        d_cost,
        rest_id,
    }
    fetch('/cart', {method: "POST", body: JSON.stringify(data), 
    headers: {
        'Content-Type':'application/json',
        'Accept':'application/json'
    },}).then(response => response.json()).then(response => {
        console.log(response.message);
        if(response.message === 'Present'){
            alert('Dish already present in Cart');
        }
        else
        {
            if(response.message === 'Please Login'){
                alert('Please Login as a Customer !!');
                window.location.replace("/customerlogin");
            }
            else
            {
                if(response.message === 'Not Allowed'){
                    window.location.replace("/profile");
                }
                else
                {
                    alert('Dish added to the cart');
                }
            }
        }
    })
}

const findDishes = (restid) =>
{
    var alld = "";
    dishes.forEach(dish => {
        if(dish.id.split(" ").pop() == restid)
        {
            alld = alld + dish.outerHTML
        }
    })
    showDishes.innerHTML = alld;
}

All.addEventListener('click', (e) => {
    var alld = "";
    dishes.forEach(dish => {
        alld = alld + dish.outerHTML
    })
    showDishes.innerHTML = alld;
    e.preventDefault();
})
