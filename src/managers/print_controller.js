module.exports = {


    getTime: () => {
        /**
         * @return {string}
         */
        const currentDate = new Date();

        const currentDayOfMonth = currentDate.getDate();
        const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
        const currentYear = currentDate.getFullYear();

        const currentHour = currentDate.getHours()
        const currentSec = currentDate.getSeconds();

        return '[' + currentDayOfMonth + "/" + (currentMonth + 1) + "/" + currentYear + ' ' + currentHour + ':' + currentSec + ']';
    },


}





