// const Firebird = require("node-firebird");
// const ambiente = require('../managers/ADController');
// const errors = require('../const/error');
//
// const userManager = require('../managers/UserManager');
//
// const crypto = require('crypto');
const moment = require("moment");


module.exports = {


    timeUtility : {
        getTimeStamp: () => {
            // let dateObj = new Date();
            // let date = dateObj.getDate();
            // let month = dateObj.getMonth() + 1;
            // let year = dateObj.getFullYear();
            // let hours = dateObj.getHours();
            // let minutes = dateObj.getMinutes();
            //
            // if (month < 10){
            //     month = '0'+month;
            // }
            // if (hours < 10){
            //     hours = '0'+hours;
            // }
            // if (minutes < 10){
            //     hours = '0'+minutes;
            // }
            //
            // let dateDisplay = year+'-'+month+'-'+date+' '+hours+':'+minutes;
            //
            //
            // return dateDisplay;
            return getMoment().toJSON();
        },
        getMoment: getMoment(),
        getDate: () => {
            return getMoment().format(dbDate);
        },
        getTime: () => {
            return getMoment().format();
        },

        getDateTime: () => {
            return getMoment().format(`${normalDate} ${time}`);
        },

        getLogTime: () => {
            return `[${getMoment().format(`${normalDate} ${time}`)}]:`;
        }
    }
}

const dbDate= 'YYYY-MM-DD';
const normalDate = 'DD/MM/YYYY';
const time = 'HH:mm:ss';



function getMoment(){
    // let dateObj = new Date();
    // let date = dateObj.getDate();
    // let month = dateObj.getMonth() + 1;
    // let year = dateObj.getFullYear();
    // let hours = dateObj.getHours();
    // let minutes = dateObj.getMinutes();
    //
    // if (month < 10){
    //     month = '0'+month;
    // }
    // if (hours < 10){
    //     hours = '0'+hours;
    // }
    // if (minutes < 10){
    //     hours = '0'+minutes;
    // }
    //
    // let dateDisplay = year+'-'+month+'-'+date+' '+hours+':'+minutes;
    //
    //
    // return dateDisplay;
    return new moment().utc(true);
}
