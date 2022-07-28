const axios = require('axios')

function f() {

    axios
        .post('http://boginni.net:11002/view/buffed',

        )
        .then(res => {
            console.log(`statusCode: ${res.status}`);
            // console.log(res.data);
        })
        .catch(error => {
            console.error(error);
        });


    // let xhr = new XMLHttpRequest();
    // xhr.open("POST", '192.168.1.3/view/buffed', true);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.setRequestHeader("ambiente", "boginni")
    // xhr.setRequestHeader("idVendedor", "4502")
    // xhr.setRequestHeader("uuid", "313884099582297096")
    // xhr.send(JSON.stringify({
    //     "rota" : null,
    //     "vendedor" : 4502,
    //     "views" : {
    //         "normal":{
    //             "MOB_VW_CLIENTE" : "2022-07-03 23:12:39"
    //         },
    //         "rota": [
    //         ]
    //     }
    // }));


}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function test() {
    console.log('start timer');
    await delay(200);
}


async function main() {
    // for(let i = 0; i < 100; i++){
    //     await test();
    // }

    f();
}


main().then(r => console.log('end'));
